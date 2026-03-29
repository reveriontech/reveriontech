export interface TeamMember {
    id: string;
    name: string;
    role: string;
    twitter?: string;
    bio: string;
    image: string;
    socials: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
}

export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Rod Albores',
        twitter: '#',
        role: 'CEO & Founder',
        bio: 'Co Founder of ReverionTech. Specializes in disruptive digital narratives and technical brutalism.',
        image: '/team/team11.jpg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/rodalbores/',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '2',
        name: 'Kent Ryan Entice',
        role: 'Back-end Developer',
        bio: 'Back-end Developer of ReverionTech. Specializes in scalable systems and performance optimization.',
        image: '/team/team22.jpg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/kent-ryan-gonzales-entice-25518535a/',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '3',
        name: 'John Rexey Cabrera',
        role: 'Front-end Developer',
        bio: 'Front-end Developer of ReverionTech mobile applications and web applications.',
        image: '/team/team33.jpg',
        socials: {
            linkedin: '#',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '4',
        name: 'Gigi Valdez',
        role: 'Front-end Developer',
        bio: 'Front-end Developer of ReverionTech With speciliese of 3d animations and web applications.',
        image: '/team/team44.jpg',
        socials: {
            linkedin: '#',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '5',
        name: 'Dangrey Concepcion',
        role: 'Back-end Developer',
        bio: 'Back-end Developer of ReverionTech With speciliese of scalable systems and performance optimization using Node.js and Rust.',
        image: '/team/team55.jpg',
        socials: {
            linkedin: '#',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '6',
        name: 'June Bation',
        role: 'AI Engineer',
        bio: 'AI Engineer of ReverionTech with specialisation in AI agenet development and military intelligence.',
        image: '/team/team66.jpg',
        socials: {
            linkedin: '#',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '7',
        name: 'Urian Buenconsejo',
        role: 'AI Orchestrator',
        bio: 'AI Agent Orchestrator of ReverionTech with specialisation in AI and web3 research and data analysis.',
        image: '/team/team 7.jpg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/urian-b-/',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '8',
        name: 'Edmund Albores',
        role: 'Full Stack Developer',
        bio: 'Full Stack Developer of ReverionTech with specialisation in web3 development and blockchain technology.',
        image: '/team/team88.jpg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/mhokzone',
            facebook: '#',
            instagram: '#',
            youtube: '#'
        }
    },
    {
        id: '9',
        name: 'RJ Solamo',
        role: 'Blockchain Developer',
        bio: 'Blockchain Developer of ReverionTech with specialisation in web3 development and blockchain technology.',
        image: '/team/team99.jpg',
        socials: {
            linkedin: 'https://www.linkedin.com/in/rjaysolamo/',
            facebook: 'https://www.facebook.com/gytchk',
            instagram: '#',
            youtube: '#'
        }
    }
];
