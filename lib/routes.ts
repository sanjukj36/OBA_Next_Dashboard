// import { AcknowledgeIcon } from "@/components/icons/acknowledge-icon";
import { AlarmIcon } from "@/components/icons/alarm-icon";
import { AlertsIcon, FuelIcon } from "@/components/icons/alerts-icon";
import { AnalyticsIcon } from "@/components/icons/analytics-icon";
import { CCTVIcon } from "@/components/icons/cctv-icon";
// import { ChartIcon } from "@/components/icons/chart-icon";
import { CompanyIcon } from "@/components/icons/company-icon";
import { CrownIcon } from "@/components/icons/crown-icon";
import { DataOverviewIcon } from "@/components/icons/data-overview-icon";
import { DeviceStatusIcon } from "@/components/icons/device-status-icon";
import { FleetIcon } from "@/components/icons/fleet-icon";
import { GeneratorsAmsNavIcon } from "@/components/icons/generators-asm-nav-icon";
import { GlobIcon } from "@/components/icons/glob-icon";
import { InstallationIcon } from "@/components/icons/installation-icon";
import { LiveStatusIcon } from "@/components/icons/live-status-icon";
import { GeofencingIcon, LocationPlaybackIcon } from "@/components/icons/location-playback-icon";
import { MachineryIcon } from "@/components/icons/machinery-icon";
import { MainEngineAmsNavIcon } from "@/components/icons/main-engine-ams-nav-icon";
import { MiscellaneousAmsNavIcon } from "@/components/icons/miscellaneous-ams-nav";
import { NetworkIcon } from "@/components/icons/network-icon";
import { OverviewIcon } from "@/components/icons/overview-icon";
import { PortSyncIcon } from "@/components/icons/port-sync-icon";
import { PowerAmsNavIcon } from "@/components/icons/power-ams-nav-icon";
import { RemoteShellAccessIcon } from "@/components/icons/remote-shell-access-icon";
import { ShipWheelIcon } from "@/components/icons/ship-wheel-icon";
import { SystemDiagramsAmsNavIcon } from "@/components/icons/sysytem-diagram-ams-nav-icon";
import { TankGaugingAmsNavIcon } from "@/components/icons/tank-gauging-ams-nav-icon";
// import { TimeIcon } from "@/components/icons/time-icon";
// import { UserAddIcon } from "@/components/icons/user-add-icon";
import { UserIcon } from "@/components/icons/user-icon";
//import { UserTypeIcon } from "@/components/icons/user-type-icon";
import { VesselIcon } from "@/components/icons/vessel-icon";
import { VideoPlaybackIcon } from "@/components/icons/video-playback-icon";
// import { WaterDropIcon } from "@/components/icons/water-drop-icon";

export type RouteItem = {
  label: string;
  href: string;
  hidden?: boolean;
  disable?: boolean;
  is_superuser?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  sameRouters?: string[];
  sub?: RouteItem[];
};

export const routes: RouteItem[] = [
  {
    label: "Dashboard",
    icon: GlobIcon,
    href: "/dashboard",
    sub: [
      { label: "Overview", icon: OverviewIcon, href: "/dashboard/overview" },
      {
        label: "Analytics",
        icon: MachineryIcon,
        href: "/dashboard/analytics",
        hidden: false
      }
    ]
  },
  {
    label: "Ams",
    icon: AnalyticsIcon,
    href: "/ams/main-engine",
    hidden: false
  },
  {
    hidden: false,
    label: "Alerts",
    icon: AlertsIcon,
    href: "/alerts",
    // sameRouters: ["/alerts/fuel-master", "/alerts/geofencing"],
    sub: [
      {
        label: "Fuel Master",
        icon: FuelIcon,
        href: "/alerts/fuel-master/realtime",
        sameRouters: [
          "/alerts/fuel-master/realtime",
          "/alerts/fuel-master/historical"
        ]
      }
    ]
  },
  {
    hidden: false,
    label: "Alarms",
    icon: AlarmIcon,
    href: "/alarms/realtime"
  },
  {
    hidden: false,
    label: "Voyage",
    icon: ShipWheelIcon,
    href: "/voyage",
    sub: [
      {
        label: "Live Status",
        icon: LiveStatusIcon,
        href: "/voyage/live-status"
      },
      {
        label: "Location Playback",
        icon: LocationPlaybackIcon,
        href: "/voyage/location-playback"
      },
      {
        label: "Geofencing",
        icon: GeofencingIcon,
        href: "/voyage/geofencing",
        sub: [
          {
            label: "Configuration",
            href: "/voyage/geofencing"
          },
          {
            label: "Alerts",
            href: "/voyage/geofencing/alerts"
          }
        ]
      },
      {
        label: "Port Sync",
        icon: PortSyncIcon,
        href: "/voyage/port-sync",
        hidden: true
      }
    ]
  },
  {
    hidden: true,
    label: "CCTV",
    href: "/cctv",
    icon: CCTVIcon,
    sub: [
      {
        label: "Video Playback",
        icon: VideoPlaybackIcon,
        href: "/cctv/playback"
      },
      {
        label: "Live Status",
        icon: DeviceStatusIcon,
        href: "/cctv/live-status"
      },
      {
        label: "Installation",
        icon: InstallationIcon,
        href: "/cctv/installation"
      }
    ]
  },
  {
    hidden: true,
    label: "Status",
    href: "/device-status",
    icon: DeviceStatusIcon,
    sub: [
      {
        label: "Network Device Status",
        icon: NetworkIcon,
        href: "/device-status/network-device-status"
      },
      {
        label: "Remote Shell Access",
        icon: RemoteShellAccessIcon,
        href: "/device-status/remote-shell-access"
      }
    ]
  },
  {
    label: "Master",
    href: "/master",
    is_superuser: true,
    icon: CrownIcon,
    sub: [
      { label: "Company", icon: CompanyIcon, href: "/master/company" },
      { label: "Fleet", icon: FleetIcon, href: "/master/fleet" },
      {
        label: "Vessel",
        icon: VesselIcon,
        href: "/master/vessel",
        sub: [
          {
            label: "Add Vessel",
            href: "/master/vessel/add-vessel"
          },
          {
            label: "Tag Configuation",
            href: "/master/vessel/tag-configuration"
          }
        ]
      },
      {
        label: "User",
        icon: UserIcon,
        href: "/user",
        sub: [
          { label: "User Type", href: "/user/user-type" },
          { label: "Add User", href: "/user/user-add" }
        ]
      }
    ]
  }
];

export const amsRoutes: RouteItem[] = [
  {
    label: "Main Engine",
    icon: MainEngineAmsNavIcon,
    href: "/ams/main-engine"
  },
  {
    label: "Data Overview",
    icon: DataOverviewIcon,
    href: "/ams/data-overview",
    disable: true
  },
  {
    label: "Generators",
    icon: GeneratorsAmsNavIcon,
    href: "/ams/dg/generators",
    disable: false
  },
  {
    label: "G/E COMMON",
    icon: GeneratorsAmsNavIcon,
    href: "/ams/dg/ge-common",
    disable: true,
    hidden: true
  },
  {
    label: "Power",
    icon: PowerAmsNavIcon,
    href: "/ams/pms",
    disable: false
  },
  {
    label: "Tank Gauging",
    icon: TankGaugingAmsNavIcon,
    href: "/ams/tank-gauging",
    disable: true
  },
  {
    label: "Miscellaneous",
    icon: MiscellaneousAmsNavIcon,
    href: "/ams/miscellaneous",
    disable: true
  },
  {
    label: "System Diagrams",
    icon: SystemDiagramsAmsNavIcon,
    href: "/ams/system-diagrams",
    disable: true
  }
];
