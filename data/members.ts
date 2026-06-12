export type Member = {
  name: string;
  role: string;
  grade?: string;
  hobby?: string;
  bio?: string;
  wants?: string;
  image?: string;
};

export type MemberYear = {
  year: string;
  label: string;
  members: Member[];
};

export const memberYears: MemberYear[] = [
  {
    year: "25-26",
    label: "25-26",
    members: [
      {
        name: "Ashwath Polali",
        role: "President & Founder",
        grade: "Sophomore",
        hobby: "Instruments, robotics, composing music",
        bio: "Founded ATC in 2025 to build a real project-focused CS club at BLHS.",
      },
      {
        name: "Gavin Krawitz",
        role: "Vice President & Co-Founder",
        grade: "Senior",
        bio: "Co-founded ATC and helped establish the club's early direction. Graduating 2026.",
      },
      {
        name: "Noah Carter",
        role: "Member",
        grade: "Sophomore",
        hobby: "Cross Country",
        bio: "A legendary warrior from an era long past, risen once more to wage a war of honour and tragedy against his mortal enemy: The CollegeBoard.",
        wants: "A small language model",
      },
      {
        name: "Grayson Magner",
        role: "Member",
        grade: "Sophomore",
        hobby: "Studying Geopolitics, Investing, Baseball",
        bio: "Howdy folks, I don't code, but I do enjoy designing, writing, and drawing.",
        wants: "A text adventure program accessible to all that combines adventures created by both ATC, as well as the general public.",
      },
      {
        name: "Jacob Hansen",
        role: "Member",
        grade: "Senior",
        hobby: "Reading",
        bio: "Long-time ATC and former Panther Robotics member.",
        wants: "Connect 4",
      },
      {
        name: "Kedar Soma",
        role: "Member",
        grade: "Sophomore",
        hobby:
          "I enjoy playing tennis and basketball — I play both pretty often and love improving my skills.",
        bio: "I'm a sophomore who loves sports, biking, and anything related to computer science. I like solving problems, learning new things, and working with people who enjoy building cool projects.",
        wants:
          "I want to learn how to build small projects that use algorithms to solve real problems, like simple games or tools that automate tasks.",
      },
      {
        name: "Ember Collison",
        role: "Member",
        grade: "Freshman",
      },
      {
        name: "Lucas Conard",
        role: "Member",
        grade: "Sophomore",
      },
      {
        name: "Beka Geleta",
        role: "Member",
        grade: "Sophomore",
      },
      {
        name: "Alexander Hoffbuhr",
        role: "Member",
        grade: "Sophomore",
      },
      {
        name: "Gage Kingdon",
        role: "Member",
        grade: "Freshman",
      },
      {
        name: "Leslie Onwong'A",
        role: "Member",
        grade: "Freshman",
      },
      {
        name: "Jack Roediger",
        role: "Member",
        grade: "Sophomore",
      },
      {
        name: "Sedrick Swai",
        role: "Member",
        grade: "Sophomore",
      },
      {
        name: "Lewi Yonas",
        role: "Member",
        grade: "Sophomore",
      },
    ],
  },
  {
    year: "26-27",
    label: "26-27",
    members: [
      {
        name: "Ashwath Polali",
        role: "President & Founder",
        grade: "Junior",
        hobby: "Instruments, robotics, composing music",
        bio: "Founded ATC in 2025 to build a real project-focused CS club at BLHS.",
      },
    ],
  },
];

// Backwards-compatible default export of the most recent year's members.
export const members: Member[] = memberYears[0].members;
