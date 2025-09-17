export async function signup(data: any) {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    return await res.json()
  } catch (err) {
    console.error("Signup request failed:", err)
    return { success: false, message: "Request failed" }
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    })

    return await res.json()
  } catch (err) {
    console.error("Login request failed:", err)
    return { success: false, message: "Request failed" }
  }
}

