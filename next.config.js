/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.pexels.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "authenticroyal.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.chefkunalkapur.com",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
