import { SignUpForm } from "@/components/sign-up-form";
import { ArrowLeft, UserPlus,ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminPanel() {
  return (
    <div className="p-8 max-w-2xl mx-auto"> 
      
        
            <SignUpForm />
       
    </div>
  )
}