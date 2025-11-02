import React from 'react';
import { TwitterIcon } from './icons';

interface SocialShareProps {
    imageUrl: string;
    prompt?: string | null;
}

const SocialShare: React.FC<SocialShareProps> = ({ imageUrl, prompt }) => {
    const text = `I created this with HeartSync AI, turning my feelings into art! ✨\n\nPrompt: "${prompt || 'An emotional masterpiece'}"\n\n#HeartSyncAI #AIArt #GenerativeArt`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    return (
        <div className="flex items-center space-x-2">
            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#0c85d0] transition-colors"
                title="Share on X/Twitter"
            >
                <TwitterIcon className="w-5 h-5 fill-current" />
            </a>
        </div>
    );
};

export default SocialShare;
