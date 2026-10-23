import { FaGithub, FaLinkedinIn, FaInstagram, FaSteam, FaGlobe, FaEnvelope, FaDiscord } from "react-icons/fa"
import { type IconType } from "react-icons"

export function getContactIcon(type: string): IconType {
  const normalized = type.toLowerCase()
  if (normalized === "email" || normalized.includes("mail")) return FaEnvelope
  if (normalized.includes("github")) return FaGithub
  if (normalized.includes("linkedin")) return FaLinkedinIn
  if (normalized.includes("instagram")) return FaInstagram
  if (normalized.includes("steam")) return FaSteam
  if (normalized.includes("discord")) return FaDiscord
  return FaGlobe
}
