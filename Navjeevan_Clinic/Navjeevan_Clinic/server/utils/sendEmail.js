import dotenv from "dotenv";

dotenv.config();

const RESEND_API_URL = "https://api.resend.com/emails";

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Navjeevan Clinic <onboarding@resend.dev>",
        to: [email],
        subject: "Navjeevan Clinic - OTP Verification",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px">
            
            <h2 style="color:#c51e3a">Navjeevan Clinic</h2>

            <p>Your verification OTP is:</p>

            <div style="
              font-size:32px;
              font-weight:700;
              letter-spacing:8px;
              margin:20px 0;
            ">
              ${otp}
            </div>

            <p>
              This OTP is valid for 5 minutes.
              Do not share it with anyone.
            </p>

          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", data);

      throw new Error(
        data?.message || "Failed to send OTP email."
      );
    }

    console.log("✅ OTP email sent successfully:", data.id);

    return data;

  } catch (error) {
    console.error("❌ OTP Email Error:", error.message);
    throw error;
  }
};

export default sendOTPEmail;