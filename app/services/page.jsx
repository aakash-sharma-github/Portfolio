"use client";
import { motion } from "framer-motion";

const servicesList = [
  {
    num: '01',
    title: 'Frontend Development',
    text: 'Leveraging the power of React, Next.js, Tailwind CSS and many other technologies, I create visually stunning and highly responsive websites. My expertise also extends to developing custom WordPress sites that seamlessly blend aesthetics with functionality',
  },
  {
    num: '02',
    title: 'Backend Development',
    text: 'With a strong command over Node.js, Express.js, and MongoDB, I develop scalable and secure backend applications. My backend solutions ensure seamless integration and performance, including custom WordPress backend developments tailored to your specific needs.',
  },
  {
    num: '03',
    title: 'Mobile App Development',
    text: 'Specializing in React Native, I create intuitive and feature-rich mobile applications. My development process focuses on delivering high-quality, cross-platform mobile apps, with custom React Native apps that stand out in the market.',
  },
  {
    num: '04',
    title: 'Python Development',
    text: 'I develop powerful and efficient backend applications using Django. My python solutions are designed to be robust and scalable, with additional experience in crafting custom WordPress websites that offer a seamless user experience.',
  }
]

const services = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 0.4,
              ease: "easeIn"
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-[30px]"
        >
          {servicesList.map((service, index) => {
            return (
              <div key={index}
                className="flex-1 flex flex-col justify-center gap-4 group"
              >
                {/* top */}
                <div
                  className="w-full flex justify-between items-center">
                  <div
                    className="text-3xl font-bold text-outline text-accent text-transparent group-hover:text-outline-hover transition-all duration-500"
                  >
                    {service.num}
                  </div>
                </div>
                {/* title */}
                <h2
                  className="text-[30px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500"
                >
                  {service.title}
                </h2>
                {/* text */}
                <p className="text-white/60">{service.text}</p>
                {/* border */}
                <div className="border-b border-white/20 w-full"></div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default services;