"use client";

import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { User, Mail, Calendar, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Profile
        </h2>
        <p className="text-muted-foreground mt-2">Manage your personal information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass md:col-span-1 border-white/10 overflow-hidden flex flex-col items-center p-8 text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 mb-4">
            <Image
              src={user.imageUrl}
              alt={user.fullName || "Profile"}
              fill
              className="object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-white">{user.fullName}</h3>
          <p className="text-sm text-primary mt-1">Free Plan</p>
        </Card>

        <Card className="glass border-white/10 md:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-white">{user.fullName || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium text-white">
                  {user.primaryEmailAddress?.emailAddress || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  }) : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
