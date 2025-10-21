"use client";
import React, { useState } from 'react'
import { Loader2, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { contactApi } from '@/lib/api';
import { Toaster, toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Please enter your full name.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Please enter your email address.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  subject: z.string().min(1, {
    message: "Please enter a subject.",
  }),
  message: z.string().min(1, {
    message: "Please enter a message.",
  }),
})

// Contact Information Component
const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      value: "aakashsharma9855@gmail.com",
      description: "Send me an email anytime",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Kathmandu, Nepal",
      description: "Available for local meetings",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
        <div className="space-y-4">
          {contactDetails.map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ x: 5 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${contact.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-lg text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{contact.title}</h4>
                  <p className="text-accent font-medium text-sm">{contact.value}</p>
                  <p className="text-white/60 text-xs">{contact.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  )
}

// Contact Form Module
const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (values) => {
    setIsLoading(true)

    // Debug logging
    console.log('Form values being submitted:', values);

    // Additional validation check
    const trimmedValues = {
      fullname: values.fullname.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    };
    
    try {
      // sends the email to the server.
      await contactApi.submitContact(trimmedValues);
      form.reset();
      toast.success('Email sent successfully!');
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to send email';
      console.error('Error:', error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8"
    >
      <div className="mb-6 md:mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
          Let's <span className="text-accent">Work Together</span>
        </h3>
        <p className="text-white/70 text-base md:text-lg">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Form validation errors:', errors);
            toast.error('Please fix the form errors before submitting.');
          })} 
          className="space-y-4 md:space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-sm md:text-base">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent h-10 md:h-11"
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-sm md:text-base">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent h-10 md:h-11"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium text-sm md:text-base">Subject</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent h-10 md:h-11"
                    placeholder="What's this about?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium text-sm md:text-base">Message</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent min-h-[120px] md:min-h-[150px] resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="pt-2"
          >
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-primary font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  <span className="text-sm md:text-base">Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-sm md:text-base">Send Message</span>
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  )
}

const Contact = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.6,
          ease: "easeIn"
        }
      }}
      className="min-h-screen py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary via-primary to-primary/90"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            Get In <span className="text-accent">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Ready to start your next project? Let's discuss how I can help bring your ideas to life.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Contact Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>
      </div>

      <Toaster richColors />
    </motion.section>
  )
}

export default Contact