import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { ReactElement } from "react";

export interface SocialMediaLink {
  name: string;
  url: string;
  iconType: 'facebook' | 'instagram' | 'twitter' | 'tiktok';
  bgColor: string;
  hoverColor: string;
}

export const getIconComponent = (iconType: string): ReactElement => {
  switch (iconType) {
    case 'facebook':
      return <FaFacebook size={24} />;
    case 'instagram':
      return <FaInstagram size={24} />;
    case 'tiktok':
      return <FaTiktok size={24} />;
    case 'twitter':
      return <FaTwitter size={24} />;
    default:
      return <FaFacebook size={24} />;
  }
};

export interface SedeSocialMedia {
  sede: string;
  socialMedia: SocialMediaLink[];
}

// Configuración de redes sociales por sede
export const SEDES_SOCIAL_MEDIA: SedeSocialMedia[] = [
  {
    sede: "MI BREVETE SEGURO IZAGUIRRE",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://www.facebook.com/share/1CyDLgDXDD/",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/mibreveteizaguirre",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@sanluismediclima?_r=1&_t=ZS-96k2M2w9iiX",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "BREVETES APURIMAC AYACUCHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/brevetesapurimacayacucho",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/brevetesapurimacayacucho",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@brevetesapurimacayacucho",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "BREVETES APURIMAC ANDAHUAYLAS",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/brevetesapurimacandahuaylas",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/brevetesapurimacandahuaylas",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL VIP IZAGUIRRE",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobalvipizaguirre",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobalvipizaguirre",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@sancristobalvipizaguirre",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL VIP CALLAO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobalvipcallao",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobalvipcallao",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/sancristobalvipcallao",
        iconType: "twitter",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL VIP HUACHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobalviphuacho",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobalviphuacho",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL VIP HUANCAVELICA",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobalviphuancavelica",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobalviphuancavelica",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@sancristobalviphuancavelica",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "MI BREVETE SEGURO ATE",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/mibreveteate",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/mibreveteate",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      }
    ]
  },
  {
    sede: "MI BREVETE SEGURO AYACUCHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/mibreveteayacucho",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/mibreveteayacucho",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@mibreveteayacucho",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL DEL PERU ICA",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobaldelperuica",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobaldelperuica",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/sancristobaldelperuica",
        iconType: "twitter",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL DEL PERU ANDAHUAYLAS",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/sancristobaldelperuandahuaylas",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/sancristobaldelperuandahuaylas",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      }
    ]
  },
  {
    sede: "RTP SAN CRISTOBAL CANTA CALLAO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtpcanta",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtpcanta",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@rtpcanta",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTP SAN CRISTOBAL CALLAO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtpcallao",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtpcallao",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/rtpcallao",
        iconType: "twitter",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTP SAN CRISTOBAL AYACUCHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtpayacucho",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtpayacucho",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@rtpayacucho",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTP SAN CRISTOBAL ANDAHUAYLAS",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtpandahuaylas",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtpandahuaylas",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/rtpandahuaylas",
        iconType: "twitter",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTV SAN CRISTOBAL AYACUCHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtvayacucho",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtvayacucho",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@rtvayacucho",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTV SAN CRISTOBAL ICA",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtvica",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtvica",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "Twitter",
        url: "https://twitter.com/rtvica",
        iconType: "twitter",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "RTV SAN CRISTOBAL HUANCAVELICA",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://facebook.com/rtvhuancavelica",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "Instagram",
        url: "https://instagram.com/rtvhuancavelica",
        iconType: "instagram",
        bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
        hoverColor: "hover:from-purple-700 hover:to-pink-600"
      },
      {
        name: "TikTok",
        url: "https://tiktok.com/@rtvhuancavelica",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  }
];

// Función para obtener las redes sociales de una sede específica
export const getSocialMediaBySede = (sedeName: string): SocialMediaLink[] => {
  const sedeConfig = SEDES_SOCIAL_MEDIA.find(config => 
    config.sede.trim().toUpperCase() === sedeName?.trim().toUpperCase()
  );
  return sedeConfig?.socialMedia || [];
};
