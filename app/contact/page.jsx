"use client";
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { emailApi } from '@/lib/emailApi';
import { Toaster, toast } from 'sonner'
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


const contact = () => {

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

    if (form.formState.isValid) {
      toast.warning('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    const emailPromise = emailApi(values)
      .then(response => {
        form.reset();
        return response;
      });

    toast.promise(emailPromise, {
      loading: 'Sending email...',
      success: () => 'Email sent successfully!',
      error: (error) => {
        const message = error?.response?.data?.message || error.message || 'Failed to send email';
        console.error('Error:', error);
        return message;
      }
    });

    emailPromise.finally(() => setIsLoading(false));
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 1,
          duration: 0.4,
          ease: "easeIn"
        }
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="xl:mr-12 xl:ml-12">
          <div className="xl:h-[60%] order-2 xl:order-none">


            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-10 bg-[#27272c] rounded-xl"
              >
                <h3 className="text-4xl text-accent">Let's Work Together.</h3>
                <p className="text-white/60">
                  I am always open to discussing product design work or partnership opportunities. Let&apos;s talk.
                </p>

                {/* inputs */}
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input  {...field} />
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
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea className="h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="max-w-40" size="lg">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Message"}
                </Button>
                <Toaster richColors />
              </form>
            </Form>

          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default contact