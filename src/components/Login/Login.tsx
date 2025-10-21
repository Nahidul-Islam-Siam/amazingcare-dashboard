/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import logo from "@/assets/logo/Logo.png"
import bg from "@/assets/logo/login-bg.png"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: any) => {
    // 🔇 No actual action – just for show
    console.log("Form submitted (design mode)", data)
  }

  return (
    <div className="min-h-screen bg-[#EAF1F8] flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F7F7F7] items-center justify-center p-12">
        <Link href="/dashboard" className="max-w-md">
         <Image
            src={bg}
            alt="App Logo"
      
            width={500}
            height={500}
            className="mx-auto"
          />
        </Link>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
      <Image
        src={logo}
        alt="App Logo"
        width={250}
        height={250}
        className="mx-auto"
      />

          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login to your account</h2>
            <p className="text-gray-600">Welcome back to your workspace</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@example.com"
                        className="h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-12 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

     

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-[#266CB7] hover:duration-75  text-white font-semibold text-base"
              >
                Log In
              </Button>
            </form>
          </Form>

     
        </div>
      </div>
    </div>
  )
}

export default Login
