import axios from "axios";

const baseUrl =
  "https://devrel-demos-access-manager.netlify.app/.netlify/functions/api"; // Adjust this base URL to your backend server's URL

export const deleteMessageAPI = async (
  messageID: string,
  channelID: string,
) => {
  return await axios.post(`${baseUrl}/livepeer/delete`, {
    messageID: messageID,
    channelID: channelID,
  });
};

export const restoreMessageAPI = async (
  messageID: string,
  channelID: string,
) => {
  return await axios.post(`${baseUrl}/livepeer/restore`, {
    messageID: messageID,
    channelID: channelID,
  });
};

export const setRestrictionsAPI = async (
  channelID: string,
  userID: string,
  ban: boolean,
  mute: boolean,
) => {
  return await axios.post(`${baseUrl}/livepeer/setrestrictions`, {
    channelID: channelID,
    userID: userID,
    ban: ban,
    mute: mute,
  });
};
