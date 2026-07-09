import axios from "axios";
import { getModel } from "../utils/model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAgent = async (state) => {

  try {

//await checkAgentLimit(
  //  state.userId,
    //"image"
  //);
 //await deductCredits(

       // state.userId,

        //"image"

   // );


    const llm =
      getModel("image");

    const promptResponse =
      await llm.invoke(`

You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:

${state.prompt}

`);

    const enhancedPrompt =
      promptResponse.content.trim();

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(
        enhancedPrompt
      )}`;
const imageResponse = await axios.get(imageUrl, {
  responseType: "arraybuffer",
});

const imageBuffer = Buffer.from(imageResponse.data);

const result = await uploadToCloudinary(
  imageBuffer,
  "WorkBenchAI/images"
);

return {
  ...state,
  response: "",
  images: [result.secure_url],
};

  } catch (error) {

    console.log(
      "Image Agent Error:",
      error
    );

    return {

      ...state,

      response:
        "❌ Failed to generate image."

    };

  }

};