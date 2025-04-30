import TimeZestAPI from "../../index.js";
import { config } from "dotenv";

// Load environment variables from .env file
config();

(async () => {
  const apiKey = process.env.TIMEZEST_API_KEY;

  if (!apiKey) {
    console.error(
      "Please set the TIMEZEST_API_KEY environment variable in your .env file.",
    );
    return;
  }

  const options = {
    logLevel: "debug",
  };

  const timeZest = new TimeZestAPI(apiKey, options);

  try {
    console.log("Fetching agents...");
    const agents = await timeZest.getAgents();
    // console.log('Agents:', agents);

    console.log("Fetching 1 agent ...");
    const agent = await timeZest.getAgents("agent.name LIKE roib");
    console.log("Agent:", agent);
    // console.log('Fetching a single scheduling request...');
    // const schedulingRequest = await timeZest.getSchedulingRequest('sreq_example_id');
    // console.log('Scheduling Request:', schedulingRequest);
  } catch (error) {
    console.error("Error:", error);
  }
})();
