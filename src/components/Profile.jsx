import React, { useState } from 'react'

import { useDispatch, useSelector } from "react-redux"; // ✅ Keep only this
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
//const isResume = true;

const Profile = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    
    // ✅ Get loading & error from the hook
    const { loading, error } = useGetAppliedJobs();

    // Check if the user is a recruiter
    const isRecruiter = user?.role === 'recruiter';

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname || "User"}</h1>
                            <p>{user?.profile?.bio || "No bio available"}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email || "No email provided"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber || "No phone number"}</span>
                    </div>
                </div>

                {/* Conditionally render skills and resume only for job seekers */}
                {!isRecruiter && (
                    <>
                        <div className='my-5'>
                            <h1>Skills</h1>
                            <div className='flex items-center gap-1'>
                                {user?.profile?.skills?.length > 0 ? 
                                    user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>) 
                                    : <span>NA</span>}
                            </div>
                        </div>
                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                            <Label className="text-md font-bold">Resume</Label>
                            {user?.profile?.resume ? 
                                <a target='_blank' href={user.profile.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>
                                    {user.profile.resumeOriginalName || "View Resume"}
                                </a> 
                                : <span>NA</span>}
                        </div>
                    </>
                )}
            </div>

            {/* Only display Applied Jobs section for job seekers */}
            {!isRecruiter && (
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>

                    {/* ✅ Properly display loading and error */}
                    {loading && <p>Loading applied jobs...</p>}
                    {error && <p className="text-red-500">Error: {error}</p>}

                    {allAppliedJobs?.length > 0 ? <AppliedJobTable /> : <p>No applied jobs found.</p>}
                </div>
            )}

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};
export default Profile