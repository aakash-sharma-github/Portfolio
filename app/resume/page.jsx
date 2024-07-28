"use client";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGit,
} from "react-icons/fa6";
import { TbBrandReactNative } from 'react-icons/tb'
import { PiMicrosoftExcelLogoDuotone } from 'react-icons/pi'
import {
  SiC,
  SiCplusplus,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiVisualstudiocode,
  SiIntellijidea,
  SiExpress,
  SiDjango,
  SiPostman
} from "react-icons/si";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";


const education = {
  title: "My Education",
  desctiption: "My schooling has been from Nepal, and thereafter from India, in the field of Computer Science and Engineering. These experiences have prepared me technically together with giving me an admiration of culture and creativity. It is the basis of my professional activities in the field of technology, combining multiple experiences with novelty. ",
  info: [
    {
      orgzanization: "Parul University Gujarat, India",
      degree: "Bachelor of Technology, Computer Science and Engineering",
      duration: "2020 - 2024"
    },
    {
      orgzanization: "Model Multiple College Janakpur, Nepal",
      degree: "12th (National Examination Board - NEB)",
      duration: "2018 - 2019"
    },
    {
      orgzanization: "Saraswati English Boarding School Mahendranagar, Nepal",
      degree: "10th (Secondary Education Examination - SEE)",
      duration: "2017"
    }
  ]
};

const skils = {
  title: "My Skils",
  desctiption: "I have a diverse skill set that spans web development, from creating engaging user interfaces with React and Next.js to building backend solutions with Node.js and Express. I’m also experienced with databases like MySQL and MongoDB, and use tools such as Git and VS Code to enhance my workflow. My broad technical expertise helps me tackle projects efficiently and creatively.",
  skilsList: {
    Languages: [
      { icon: <FaHtml5 />, name: "HTML5" },
      { icon: <FaCss3 />, name: "CSS3" },
      { icon: <FaJs />, name: "JavaScript" },
      { icon: <FaPython />, name: "Python" },
      { icon: <SiC />, name: "C" },
      { icon: <SiCplusplus />, name: "C++" },
      { icon: <FaJava />, name: "Java" }
    ],
    Frameworks: [
      { icon: <FaReact />, name: "React.js" },
      { icon: <SiNextdotjs />, name: "Next.js" },
      { icon: <FaNodeJs />, name: "Node.js" },
      { icon: <SiExpress />, name: "Express" },
      { icon: <SiTailwindcss />, name: "Tailwind CSS" },
      { icon: <SiDjango />, name: "Django" },
      { icon: <TbBrandReactNative />, name: "React Native" },
    ],
    Tools: [
      { icon: <FaGithub />, name: "Github" },
      { icon: <FaGit />, name: "Git" },
      { icon: <SiVisualstudiocode />, name: "VS Code" },
      { icon: <SiIntellijidea />, name: "IntelliJ IDEA" },
      { icon: <SiPostman />, name: "Postman" },
      { icon: <PiMicrosoftExcelLogoDuotone />, name: "Microsoft Excel" },
    ],
    Database: [
      { icon: <SiMysql />, name: "MySQL" },
      { icon: <SiMongodb />, name: "MongoDB" },
    ]
  }
};

const about = {
  title: "About Me",
  desctiption: "I’m a tech enthusiast with a strong background in software development and web technologies. I love tackling challenges and am always eager to learn and grow in the tech field.",
  info: [
    {
      fieldName: "Name",
      fieldValue: "Aakash Sharma"
    },
    {
      fieldName: "Email",
      fieldValue: "aakashsharma9855@gmail.com"
    },
    {
      fieldName: "Nationality",
      fieldValue: "Nepali"
    },
    {
      fieldName: "Languages",
      fieldValue: "English, Hindi, Nepali"
    },
    {
      fieldName: "Freelance",
      fieldValue: "Available"
    }
  ]
};

const experience = {
  title: "My Experience",
  desctiption: "My internships at BlueEra Softech and CodeClause have been incredibly rewarding. At BlueEra Softech, I worked on diverse software projects, learning the value of teamwork and problem-solving. At CodeClause, I honed my web development skills, tackling creative and challenging projects. These experiences have sharpened my technical abilities and prepared me to excel in dynamic environments.",
  info: [
    {
      company: "BlueEra Softech Pvt. Ltd.",
      position: "Software Engineer Intern",
      duration: "jan-2024 - apr-2024"
    },
    {
      company: "CodeClause",
      position: "Web Developer Intern",
      duration: "july-2023 - august-2023"
    }
  ]
};

const certificate = {
  title: "Certifications",
  desctiption: "I’ve earned certifications that enhance my skills and knowledge across various areas of tech. These include hands-on training in front-end and back-end development, as well as expertise in tools like Microsoft Excel. Each certification has equipped me with valuable insights and practical skills, helping me stay at the forefront of the tech industry.",
  info: [
    {
      course: "Front End Web Development using Angular",
      place: "Parul University",
      mode: "Offline",
    },

    {
      course: "Zero To Prototype With NODE.JS",
      place: "Parul University",
      mode: "Offline",
    },

    {
      course: "Zero To Hero in MicroSoft Excel",
      place: "Udemy",
      mode: "Online",
    },

    {
      course: "Web Development Intern",
      place: "CodeClause",
      mode: "Online",
    },

    {
      course: "Meta Front-End Developer Professional Certificate",
      place: "Coursera",
      mode: "Offline",
    },

    {
      course: "Software Engineering Internship",
      place: "BlueEra Softech Pvt. Ltd.",
      mode: "Offline",
    },
  ]
}


const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 1,
          duration: 0.4,
          ease: "easeIn"
        }
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        {/* why hire me? */}
        <Tabs
          defaultValue="education"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <div className="text-center xl:mb-24 ">
            </div>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skils">Skils</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* content */}
          <div className="min-h-[70vh] w-full">

            {/* education */}
            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{education.title}</h3>
                <p className="max-w-[1200px] text-white/60 mx-auto xl:mx-0">
                  {education.desctiption}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {education.info.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[190px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl xl:max-w-[420px] lg:max-w-[300px] min-h-[70px] text-center lg:text-left">
                            {item.degree}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[10px] h-[10px] rounded-full bg-accent"></span>
                            <p className="text-white/60">
                              {item.orgzanization}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* skils */}
            <TabsContent value="skils" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{skils.title}</h3>
                <p className="max-w-[1200px] text-white/60 mx-auto xl:mx-0">
                  {skils.desctiption}
                </p>
              </div>

              {Object.entries(skils.skilsList).map(([category, skills]) => (
                <div key={category} className="mb-4">
                  <h3 className="text-2xl font-semibold text-white mb-4">{category}</h3>
                  <ul className="flex flex-wrap gap-4">
                    {skills.map((skill, index) => (
                      <li key={index} className="w-[50px] h-[50px]">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-full h-full bg-[#232329] rounded-xl flex justify-center items-center group">
                              <div className="text-3xl group-hover:text-accent transition-all duration-300">
                                {skill.icon}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="capitalize">{skill.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}


            </TabsContent>

            {/* experience */}
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{experience.title}</h3>
                <p className="max-w-[1200px] text-white/60 mx-auto xl:mx-0">
                  {experience.desctiption}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {experience.info.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl xl:max-w-[420px] lg:max-w-[300px] min-h-[70px] text-center lg:text-left">
                            {item.position}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[10px] h-[10px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{item.company}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* about me */}
            <TabsContent value="about" className="w-full text-center xl:text-left"
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">{about.title}</h3>
                <p className="max-w-[1200px] text-white/60 mx-auto xl:mx-0">{about.desctiption}</p>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  {about.info.map((item, index) => {
                    return (
                      <li key={index} className="flex items-center justify-center xl:justify-start gap-4">
                        <span className="text-white/60">{item.fieldName}:</span>
                        <span className='text-xl'>{item.fieldValue}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>

            {/* certifications */}
            <TabsContent value="certifications" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{certificate.title}</h3>
                <p className="max-w-[1200px] text-white/60 mx-auto xl:mx-0">
                  {certificate.desctiption}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {certificate.info.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-center lg:items-start gap-1"
                        >
                          <span className="text-accent">{item.mode}</span>
                          <h3 className="text-xl xl:max-w-[420px] lg:max-w-[300px] min-h-[70px] text-center lg:text-left">
                            {item.course}
                          </h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[10px] h-[10px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{item.place}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Resume;
