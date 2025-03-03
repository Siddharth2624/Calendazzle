'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
export default function ProfileForm({existingusername=''}:{existingusername?:string}){
    const [username,setUsername] = useState(existingusername);
    const [isSaved, setIsSaved] = useState(false);
    const [isError,setIsError] = useState(false);
    const router = useRouter();
    async function handleSubmit(e:FormEvent){
        e.preventDefault();
        setIsSaved(false);
        setIsError(false);
        const response = await axios.put('/api/profile',{username});
        if(response.data){
            setIsSaved(true);
            if(!existingusername && username){
                router.push('/dashboard/event-types');
                router.refresh();
            }
        }
        else{
            setIsError(true);
        }
    }
    return (
        <form 
                onSubmit={handleSubmit}
                className="max-w-xs mx-auto mt-8">
                {isSaved && (
                    <p>Settings Saved!</p>
                )}
                {isError && (
                    <p>Error!</p>
                )}
                <label>
                    <span>Username</span>
                    <input type="text" 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    />
                    <div className="text-center mt-4">
                        <button type="submit" className="btn-blue !px-8">
                            Save
                        </button>
                    </div>
                </label>
            </form>
    );
}