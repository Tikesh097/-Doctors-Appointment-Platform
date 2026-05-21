"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Helper function to get current doctor
 */
async function getCurrentDoctor() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const doctor = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!doctor) {
    throw new Error("User not found");
  }

  if (doctor.role !== "DOCTOR") {
    throw new Error("User is not a doctor");
  }

  return doctor;
}

/**
 * Set doctor's availability slots
 */
export async function setAvailabilitySlots(formData) {
  try {
    const doctor = await getCurrentDoctor();

    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");

    if (!startTime || !endTime) {
      throw new Error("Start time and end time are required");
    }

    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error("Start time must be before end time");
    }

    // Delete previous slots
    await db.availability.deleteMany({
      where: {
        doctorId: doctor.id,
      },
    });

    // Create new slot
    const newSlot = await db.availability.create({
      data: {
        doctorId: doctor.id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: "AVAILABLE",
      },
    });

    revalidatePath("/doctor");

    return {
      success: true,
      slot: newSlot,
    };
  } catch (error) {
    console.error("Failed to set availability:", error);

    throw new Error("Failed to set availability: " + error.message);
  }
}

/**
 * Get doctor's current availability slots
 */
export async function getDoctorAvailability() {
  try {
    const doctor = await getCurrentDoctor();

    const availabilitySlots = await db.availability.findMany({
      where: {
        doctorId: doctor.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return {
      slots: availabilitySlots,
    };
  } catch (error) {
    console.error("Failed to fetch availability:", error);

    throw new Error(
      "Failed to fetch availability slots: " + error.message,
    );
  }
}

/**
 * Get doctor's upcoming appointments
 */
export async function getDoctorAppointments() {
  try {
    const doctor = await getCurrentDoctor();

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: {
          in: ["SCHEDULED"],
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return {
      appointments,
    };
  } catch (error) {
    console.error("Failed to fetch appointments:", error);

    throw new Error(
      "Failed to fetch appointments: " + error.message,
    );
  }
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (
      appointment.doctorId !== user.id &&
      appointment.patientId !== user.id
    ) {
      throw new Error(
        "You are not authorized to cancel this appointment",
      );
    }

    await db.$transaction(async (tx) => {
      await tx.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: appointment.patientId,
          amount: 2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      await tx.creditTransaction.create({
        data: {
          userId: appointment.doctorId,
          amount: -2,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      await tx.user.update({
        where: {
          id: appointment.patientId,
        },
        data: {
          credits: {
            increment: 2,
          },
        },
      });

      await tx.user.update({
        where: {
          id: appointment.doctorId,
        },
        data: {
          credits: {
            decrement: 2,
          },
        },
      });
    });

    if (user.role === "DOCTOR") {
      revalidatePath("/doctor");
    } else {
      revalidatePath("/appointments");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to cancel appointment:", error);

    throw new Error(
      "Failed to cancel appointment: " + error.message,
    );
  }
}

/**
 * Add appointment notes
 */
export async function addAppointmentNotes(formData) {
  try {
    const doctor = await getCurrentDoctor();

    const appointmentId = formData.get("appointmentId");
    const notes = formData.get("notes");

    if (!appointmentId || !notes) {
      throw new Error("Appointment ID and notes are required");
    }

    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        notes,
      },
    });

    revalidatePath("/doctor");

    return {
      success: true,
      appointment: updatedAppointment,
    };
  } catch (error) {
    console.error("Failed to add notes:", error);

    throw new Error(
      "Failed to update notes: " + error.message,
    );
  }
}

/**
 * Mark appointment as completed
 */
export async function markAppointmentCompleted(formData) {
  try {
    const doctor = await getCurrentDoctor();

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    const appointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        doctorId: doctor.id,
      },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      throw new Error(
        "Appointment not found or not authorized",
      );
    }

    if (appointment.status !== "SCHEDULED") {
      throw new Error(
        "Only scheduled appointments can be marked as completed",
      );
    }

    const now = new Date();
    const appointmentEndTime = new Date(appointment.endTime);

    if (now < appointmentEndTime) {
      throw new Error(
        "Cannot mark appointment as completed before end time",
      );
    }

    const updatedAppointment = await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath("/doctor");

    return {
      success: true,
      appointment: updatedAppointment,
    };
  } catch (error) {
    console.error(
      "Failed to mark appointment completed:",
      error,
    );

    throw new Error(
      "Failed to mark appointment as completed: " +
        error.message,
    );
  }
}