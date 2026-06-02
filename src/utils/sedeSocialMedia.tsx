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
        url: "https://www.facebook.com/people/Escuela-San-Cristobal-Izaguirre/61581820865189/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@san.cristobal.iza",
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
        url: "https://www.facebook.com/people/San-Cristobal/61588533284685/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@sancristobalvip7",
        iconType: "tiktok",
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
        url: "https://www.facebook.com/people/San-Cristobal-VIP-Huacho/61559091434560/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@sancristobalvip_huacho7",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
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
        url: "https://www.facebook.com/people/Mi-Brevete-Seguro-Ate/61586863258945/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@mi.brevete.seguro1",
        iconType: "tiktok",
        bgColor: "bg-black",
        hoverColor: "hover:bg-zinc-800"
      }
    ]
  },
  {
    sede: "SAN CRISTOBAL VIP AYACUCHO",
    socialMedia: [
      {
        name: "Facebook",
        url: "https://www.facebook.com/people/San-Cristobal-Vip-Ayacucho/100077315710754/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@sancristobalvipayacucho",
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
        url: "https://www.facebook.com/people/Escuela-de-Conductores-San-Crist%C3%B3bal-del-Per%C3%BA-Ica/100070900473823/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@sancristobal.ica",
        iconType: "tiktok",
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
        url: "https://www.facebook.com/people/San-Crist%C3%B3bal-Del-Per%C3%BA-Andahuaylas/61557770627991/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
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
        url: "https://www.facebook.com/people/Mi-Brevete-Seguro-Sede-Huacavelica/pfbid02dtz5EaLkag98vXPVEcQx1EC6HuWDfkUd793WFi7mvDMLZcvZgLPiMA2SERxbTC7Gl/#",
        iconType: "facebook",
        bgColor: "bg-blue-600",
        hoverColor: "hover:bg-blue-700"
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@mi.brevete.seguro",
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
