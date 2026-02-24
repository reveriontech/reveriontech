export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    socials: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
}

export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        role: 'Founder & Creative Director',
        bio: 'Visionary architect behind ReverionTech. Specializes in disruptive digital narratives and technical brutalism.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        socials: {
            twitter: '#',
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: '2',
        name: 'Elena Vance',
        role: 'Lead Systems Architect',
        bio: 'Master of performance and scalable systems. Elena ensures our technical foundation is as solid as our vision.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        socials: {
            linkedin: '#',
            github: '#'
        }
    },
    {
        id: '3',
        name: 'Marcus Chen',
        role: 'Senior UI Engineer',
        bio: 'Marcus turns pixels into experiences. Specialist in advanced animations and experimental layouts.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
        socials: {
            twitter: '#',
            github: '#'
        }
    },
    {
        id: '4',
        name: 'Sarah Jenkins',
        role: 'Strategy Lead',
        bio: 'Defining the "Why" behind the "What". Sarah bridges the gap between technical execution and brand strategy.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1974&auto=format&fit=crop',
        socials: {
            linkedin: '#',
            twitter: '#'
        }
    }
];
