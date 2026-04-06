import React from 'react';
import { motion } from 'framer-motion';
import SocialIcon from './SocialIcon';
import NexusLogo from './NexusLogo';

const Footer = () => {
  const footerSections = [
    {
      title: "Community",
      links: [
        { name: "Organize a hackathon", url: "#" },
        { name: "Explore hackathons", url: "#" },
        { name: "Code of Conduct", url: "#" },
        { name: "Brand Assets", url: "#" },
        { name: "Documentation", url: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", url: "#" },
        { name: "Blog", url: "#" },
        { name: "Careers", url: "#" },
        { name: "Changelog", url: "#" },
        { name: "Privacy", url: "#" },
        { name: "Terms", url: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Guide", url: "#" },
        { name: "Status", url: "#" },
        { name: "Contact Us", url: "#" }
      ]
    }
  ];

  const socialLinks = [
    { platform: "instagram", url: "https://www.instagram.com/arshxrizz/" },
    { platform: "github", url: "https://github.com/Arshrizz" },
    { platform: "discord", url: "#" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/arsh-siddiqui/" }
  ];

  return (
    <footer className="relative z-10 w-full pt-20 pb-10 px-8 lg:px-20 border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Brand Section */}
        <div className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-md">
            We love <span className="text-neon-indigo">software</span> and the <span className="text-neon-green">people</span> who build it.
          </h2>
          
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <SocialIcon key={i} platform={social.platform} url={social.url} />
            ))}
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerSections.map((section, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-gray-500 uppercase text-xs font-bold tracking-[0.2em]">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <NexusLogo size="sm" />
          <span className="font-bold text-xl tracking-tighter uppercase text-white">Nexus Studio</span>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">© 2026, Nexus Studio Lab</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest ont-bold">Made with <span className="text-neon-green">Passion</span> for the Builder</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
