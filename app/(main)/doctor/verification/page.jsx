import { getCurrentUser } from '@/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ClipboardCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'


const VerificationPage = async () => {
    const user = await getCurrentUser();

    // if already verified, redirect to dashboard
    if (user?.verificationStatus === "VERIFIED") {
        redirect('/doctor');
    }

    const isRejected = user?.verificationStatus === "REJECTED";

    return <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
            <Card className="border-emerald-900/20">
                <CardHeader className="text-center">
                    <div
                        className={`mx-auto p-4 ${isRejected ? "bg-red-900/20" : "bg-amber-900/20"
                            } rounded-full mb-4 w-fit`}
                    >
                        {isRejected ? (
                            <XCircle className='h-8 w-8 text-red-400' />
                        ) : (
                            <ClipboardCheck className='h-8 w-8 text-amber-400' />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        {isRejected ?
                            "Verification Declined" : "Verification in Progress"}
                    </CardTitle>
                    <CardDescription>
                        {isRejected ?
                            "Unfortunately, your verification was declined. Please review the requirements and submit your documents again." :
                            "Thank you for Submitting your Information."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isRejected ? (
                        <div className='bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start'>
                            <AlertCircle className='h-5 w-5 text-red-400 mr-3 mt-0.5 shrink-0' />
                            <div className='text-muted-foreground text-left'>
                                <p className='mb-2'>
                                    Our administrative team reviewed your application and
                                    found that it doesn&apos;t meet our current requirements.
                                    Common reasons for rejection include:
                                </p>
                                <ul className='list-disc pl-5 space-y-1 mb-3'>
                                    <li>Incomplete documentation</li>
                                    <li>Discrepancies in the information provided</li>
                                    <li>Failure to meet specific criteria outlined in our verification guidelines</li>
                                </ul>
                                <p>You can update your information and resubmit your application at any time.</p>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start'>
                            <AlertCircle className='h-5 w-5 text-amber-400 mr-3 mt-0.5 shrink-0' />
                            <p className='text-muted-foreground text-left'>
                                Your profile is currently under review by our administartive team.
                                This process typically takes 1-3 business days.
                                You&apos;ll receive a notification once the review is complete.
                                We appreciate your patience during this time.
                            </p>
                        </div>
                    )}

                    <p className='text-muted-foreground mb-6'>
                        {isRejected ?
                            " You can update your doctor profile and resubmit for verification. Please ensure that all required documents are accurate and complete to increase the chances of approval." :
                            "While you wait, you can familiarize yourself with our platform team or reach out to our support team for assistance."}
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Button
                            asChild
                            variant="outline"
                            className="bg-emerald-900/30"
                        >
                            <Link href="/">Return to Home</Link>

                        </Button>
                    </div>
                </CardContent>

            </Card>
        </div>
    </div>

}

export default VerificationPage
