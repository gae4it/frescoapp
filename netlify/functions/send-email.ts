import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const { to, subject, text, customerEmail } = JSON.parse(event.body || "{}");

    // Log the email content for debugging
    console.log("=== NEW ORDER EMAIL ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Customer Email:", customerEmail);
    console.log("Content:", text);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Email processed" }),
    };
  } catch (error) {
    console.error("Error processing email:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
