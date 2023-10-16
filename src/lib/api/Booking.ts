import axios from "axios";

export const BookFlight = async (data: object) => {
  try {
    const response = await axios.post(
      "https://eo5eo2dqy2y0ds6.m.pipedream.net",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
