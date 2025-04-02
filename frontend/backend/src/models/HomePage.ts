import mongoose, { Schema, Document } from 'mongoose';

export interface IHomePageContent extends Document {
  banner: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    content: string;
    image: string;
  };
  rooms: {
    title: string;
    subtitle: string;
    roomsData: {
      id: string;
      title: string;
      description: string;
      price: string;
      image: string;
    }[];
  };
  services: {
    title: string;
    subtitle: string;
    servicesData: {
      id: string;
      title: string;
      description: string;
      icon: string;
    }[];
  };
  contact: {
    title: string;
    address: string;
    phone: string[];
    email: string;
  };
}

const HomePageSchema: Schema = new Schema(
  {
    banner: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      buttonText: { type: String, required: true },
      backgroundImage: { type: String, required: true }
    },
    about: {
      title: { type: String, required: true },
      content: { type: String, required: true },
      image: { type: String, required: true }
    },
    rooms: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      roomsData: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          price: { type: String, required: true },
          image: { type: String, required: true }
        }
      ]
    },
    services: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      servicesData: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: { type: String, required: true }
        }
      ]
    },
    contact: {
      title: { type: String, required: true },
      address: { type: String, required: true },
      phone: [{ type: String }],
      email: { type: String, required: true }
    }
  },
  {
    timestamps: true
  }
);

export interface IHomePageImage extends Document {
  type: 'banner' | 'about' | 'room' | 'background';
  roomId?: string;
  imagePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

const HomePageImageSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['banner', 'about', 'room', 'background']
    },
    roomId: {
      type: String
    },
    imagePath: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const HomePage = mongoose.model<IHomePageContent>('HomePage', HomePageSchema);
export const HomePageImage = mongoose.model<IHomePageImage>('HomePageImage', HomePageImageSchema); 