export const impact_data = JSON.parse(
  `{
       "beam_logo": null,
        "chain": {
            "name": "Web Test Chain",
            "logo": null,
            "rect_logo": null
        },
        "nonprofits": [
            {
                "id": 5,
                "name": "Sea Horse Brigade",
                "cause": "Sustainability",
                "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/childmind.jpg",
                "impact_description": "Remove 3 six-pack rings worth of plastic from the ocean.",
                "website": null,
                "impact": { "percentage": 0 }
            },
            {
                "id": 12,
                "name": "UNHCR",
                "cause": "Refugee Resettlement",
                "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/unhcr.jpg",
                "impact_description": "a mattress for a displaced family",
                "website": null,
                "impact": {
                    "chain_donated": 0,
                    "match_donated": 0,
                    "total_donated": 15.45,
                    "target_donation_amount": 2500.00
                }
            },
            {
                "id": 11,
                "name": "Red Hook Initiative",
                "cause": "Local Community Support",
                "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/redhookinit1.jpg",
                "impact_description": "one day of food for the farm chickens",
                "website": null,
                "impact": { "percentage": 0 }
            },
            {
                "id": 6,
                "name": "Little Yogi Bears",
                "cause": "Disaster Relief",
                "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/covenanthouse.png",
                "impact_description": "Provide 1 smoke mask for a person affected by wildfire smoke.",
                "website": null,
                "impact": {
                    "chain_donated": 0,
                    "match_donated": 0,
                    "total_donated": 100.58,
                    "target_donation_amount": 1000.00
                }
            }
        ]
    }`
);

export const nonprofit_data = JSON.parse(`{
    "beam_logo": null,
    "store": {
        "id": 6,
        "chain_name": "Web Test Chain",
        "logo": null,
        "rect_logo": null,
        "donation_percentage": 0.01
    },
    "user_can_match": false,
    "nonprofits": [
        {
            "id": 5,
            "description": "Helps our ocean's wildlife thrive despite the changing currents by removing plastic pollution from the sea.",
            "name": "Sea Horse Brigade",
            "cause": "Sustainability",
            "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/childmind.jpg",
            "website": null,
            "impact_description": "Remove 3 six-pack rings worth of plastic from the ocean.",
            "impact": { "percentage": 0 }
        },
        {
            "id": 12,
            "description": "A UN agency working to provide shelter and critical social services to refugees around the globe",
            "name": "UNHCR",
            "cause": "Refugee Resettlement",
            "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/unhcr.jpg",
            "website": null,
            "impact_description": "a mattress for a displaced family",
            "impact":  {
                "chain_donated": 0,
                "match_donated": 0,
                "total_donated": 15.45,
                "target_donation_amount": 2500.00
            }
        },
        {
            "id": 11,
            "description": "Red Hook Initiative confronts systemic inequity by annually reaching 450 Red Hook Youth through empowering programs, operating Brooklyn's largest urban farm, connecting 5,000 residents to a free mesh internet network, and returning $1M to the community through hiring local.",
            "name": "Red Hook Initiative",
            "cause": "Local Community Support",
            "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/redhookinit1.jpg",
            "website": null,
            "impact_description": "one day of food for the farm chickens",
            "impact": { "percentage": 0 }
        },
        {
            "id": 6,
            "description": "Provides wildfire safety training to local schools as well as smoke masks to communities affected by wildfire smoke.",
            "name": "Little Yogi Bears",
            "cause": "Disaster Relief",
            "image": "https://beam-sdk.s3.amazonaws.com/nonprofit_image/covenanthouse.png",
            "website": null,
            "impact_description": "Provide 1 smoke mask for a person affected by wildfire smoke.",
            "impact": {
                "chain_donated": 0,
                "match_donated": 0,
                "total_donated": 100.58,
                "target_donation_amount": 1000.00
            }
        }
    ],
    "last_nonprofit": null,
    "promos": []
}`);
