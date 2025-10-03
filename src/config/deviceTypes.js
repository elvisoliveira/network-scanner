export const deviceTypes = {
    printer: {
        ports: [631, 9100, 515, 80, 443], // IPP, AppSocket/HP JetDirect, LPR, HTTP(S)
        keywords: ['printer', 'hp', 'canon', 'epson', 'brother', 'samsung', 'lexmark', 'kyocera', 'xerox', 'ricoh'],
        services: ['ipp', 'http', 'jetdirect', 'lpd'],
        bannerPatterns: [
            /^@PJL/i,
            /^HP-/i,
            /^EPSON/i,
            /IPP-/i,
            /printer/i
        ]
    },
    router: {
        ports: [80, 443, 8080, 53, 67, 68, 1723], // Added 1723 for PPTP VPN (common on DrayTek)
        keywords: ['router', 'gateway', 'tp-link', 'netgear', 'linksys', 'asus', 'mikrotik', 'cisco', 'huawei', 'draytek', 'vigor'],
        services: ['http', 'https', 'dns', 'dhcp', 'pptp'],
        bannerPatterns: [
            /Router/i,
            /Gateway/i,
            /HTTP.*Router/i,
            /DrayTek/i,
            /Vigor/i,
            /^Server: Vigor\b/i,  // DrayTek Vigor specific HTTP server header
            /^WWW-Authenticate:.*DrayTek/i  // DrayTek auth challenge
        ]
    },
    camera: {
        ports: [80, 554, 8080, 37777, 34567], // HTTP, RTSP, Dahua, HikVision
        keywords: ['camera', 'webcam', 'hikvision', 'dahua', 'axis', 'avigilon', 'hanwha', 'onvif'],
        services: ['rtsp', 'http', 'onvif'],
        bannerPatterns: [
            /RTSP/i,
            /ONVIF/i,
            /IPCamera/i
        ]
    },
    nas: {
        ports: [80, 443, 22, 21, 139, 445, 111, 2049], // HTTP(S), SSH, FTP, SMB, NFS
        keywords: ['nas', 'synology', 'qnap', 'storage', 'buffalo', 'netgear', 'readynas'],
        services: ['ssh', 'ftp', 'smb', 'http', 'nfs'],
        bannerPatterns: [
            /NAS/i,
            /Storage/i,
            /Synology/i,
            /QNAP/i
        ]
    }
};
