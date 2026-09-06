import { NextResponse } from "next/server";

export function setAuthCookie(token: string, message = "Login successful") {
  const response = NextResponse.json(
    {
      message,
      token,
    },
    { status: 200 }
  );

  response.cookies.set("token", token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}