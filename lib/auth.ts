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
