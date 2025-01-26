import { NextResponse } from "next/server"
import axios from "axios"
import { generateOTP } from "@/lib/utils"

const API_URL = "https://676112646be7889dc35fa055.mockapi.io/users"
const ADMIN_EMAILS = ["admin@example.com", "superadmin@example.com"]

// In-memory store for OTPs and email logs (in a real app, use a database)
const otpStore: { [email: string]: string } = {}
const emailLogs: { email: string; otp: string; timestamp: string }[] = []

export async function POST(request: Request) {
  try {
    const { username, email } = await request.json()
    console.log("Received registration request:", { username, email })

    // Check if user already exists
    const existingUserResponse = await axios.get(`${API_URL}?email=${email}`)
    const existingUsers = existingUserResponse.data

    if (existingUsers.length > 0) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    otpStore[email] = otp

    // Log the email (in a real app, send the email)
    const logEntry = { email, otp, timestamp: new Date().toISOString() }
    emailLogs.push(logEntry)
    console.log("Email sent:", logEntry)

    return NextResponse.json({ message: "OTP sent to email", email }, { status: 200 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { username, email, otp, password } = await request.json()
    console.log("Received registration confirmation:", { username, email, otp })

    if (otpStore[email] !== otp) {
      console.log("Invalid OTP for:", email)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Create new user
    const response = await axios.post(API_URL, {
      username,
      email,
      password,
      role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
      balance: 0,
      
    })

    if (response.status !== 201) {
      console.error("Failed to create user:", response.status, response.data)
      throw new Error("Failed to create user")
    }

    const newUser = response.data
    console.log("New user created:", newUser.id)

    // Clear OTP
    delete otpStore[email]

    return NextResponse.json({ message: "User created successfully", userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.log("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

