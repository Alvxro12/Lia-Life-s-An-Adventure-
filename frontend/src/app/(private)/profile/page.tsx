"use client";

import { ProfileHeader } from "@/components/profile/profileHeader";
import { CharacterCard } from "@/components/profile/charactercard";
import { ProfileStats } from "@/components/profile/profileStats";

export default function ProfilePage() {
    return (
        <div className="w-full h-full max-w-3xl mx-auto py-8 px-4 space-y-8 flex flex-col justify-center">
            
            <ProfileHeader />

            <CharacterCard 
                name="Laro" 
                level={3} 
                xp={40} 
                nextLevelXP={100} 
            />

            <ProfileStats
                missionsCompleted={8}
                tasksCompleted={51}
                streak={6}
            />
        </div>
    );
}
