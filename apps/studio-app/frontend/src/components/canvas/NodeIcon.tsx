import React from 'react';
import {
  Activity,
  ArrowRightLeft,
  Banknote,
  Binary,
  Box,
  Briefcase,
  Building,
  Car,
  Coins,
  Cpu,
  CreditCard,
  FileText,
  FolderKanban,
  GitCommit,
  Globe,
  Image as ImageIcon,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  Phone,
  Radio,
  Scale,
  ScanFace,
  Search,
  Send,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Table,
  Tag,
  User,
  UserCheck,
  Video,
  Archive,
  HelpCircle,
} from 'lucide-react';

interface NodeIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  activity: Activity,
  archive: Archive,
  'arrow-right-left': ArrowRightLeft,
  banknote: Banknote,
  binary: Binary,
  box: Box,
  briefcase: Briefcase,
  building: Building,
  car: Car,
  coins: Coins,
  cpu: Cpu,
  'credit-card': CreditCard,
  'file-text': FileText,
  'folder-kanban': FolderKanban,
  'git-commit': GitCommit,
  globe: Globe,
  image: ImageIcon,
  landmark: Landmark,
  lock: Lock,
  mail: Mail,
  'map-pin': MapPin,
  megaphone: Megaphone,
  'message-square': MessageSquare,
  mic: Mic,
  phone: Phone,
  radio: Radio,
  scale: Scale,
  'scan-face': ScanFace,
  search: Search,
  send: Send,
  server: Server,
  shield: Shield,
  'shield-check': ShieldCheck,
  smartphone: Smartphone,
  table: Table,
  tag: Tag,
  user: User,
  'user-check': UserCheck,
  video: Video,
};

export const NodeIcon: React.FC<NodeIconProps> = ({ name, size = 20, className, style }) => {
  const iconKey = (name || '').toLowerCase();
  const Component = ICON_MAP[iconKey] || HelpCircle;
  return <Component size={size} className={className} style={style} aria-hidden="true" />;
};
