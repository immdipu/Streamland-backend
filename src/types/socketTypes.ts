interface User {
  _id: string;
  username: string;
  profilePic: string;
  fullName: string;
}

export interface MessageReceivedTypes {
  chat: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: string[];
    groupAdmin: string;
  };
  content: string;
  createdAt: string;
  sender: {
    _id: string;
    fullName: string;
    username: string;
    profilePic: string;
  };
  _id: string;
}
