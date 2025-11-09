## Inspiration

Shopping for a car is overwhelming—even more so when choosing between trim levels, financing options, long-term costs, and lifestyle needs. Toyota has one of the most diverse and reliable vehicle lineups in the world, yet most customers still struggle to find the right car for their real life. Traditional filters (MPG, price, body type) don't capture someone planning for a baby, someone who hates loud cabins, or someone who takes long road trips every month.

We wanted to build a solution that feels like a personalized Toyota concierge—one that understands a person's lifestyle, personality, habits, and long-term needs, and then matches them to their dream car.

## What it does

Our platform is an intelligent car-shopping companion designed specifically for Toyota customers. It makes discovering the right Toyota vehicle simple, personalized, and insightful through:

**AI-Powered Lifestyle Recommender**  
Asks users human-centric questions—family size, road trip frequency, future plans, commute length—and recommends Toyota vehicles that fit their life, not just their specs.

**Speech-to-Text Capability**
For ease of use by customers, our speech-to-text option allows for long texts to be spoken to our chatbot to allow for fast and quick information about vehicle options and interests.

**Driving Personality Quiz**  
Matches users with cars based on how they drive: aggressive, cautious, tech-averse, gadget-lover, noise-sensitive, comfort-focused, DIY maintenance vs. low-maintenance preferences, etc.

**Behavioral & Sensory Preference Matching**  
Filters vehicles based on niche needs like cabin quietness, seat comfort, engine feel, interior tech adoption, and ease of maintenance.

**Weighted Comparison Engine**  
Users assign importance sliders (e.g., Safety 10/10, Speed 2/10, Cargo 8/10), and the platform automatically ranks Toyota vehicles based on their unique priorities.

**True Cost Calculator**  
Goes beyond the sticker price. It estimates:
- Financing vs. leasing vs. buying used
- Expected maintenance over ownership (using historical cost trends)
- Insurance & fuel impact based on lifestyle
- Long-term cost of ownership

**Explore All Financing Options**  
Side-by-side comparisons of lease, finance, and used-car alternatives—helping customers make financially informed decisions.

**Community Reviews & Social Comparison**  
Users can compare vehicles with friends, browse community insights, and see what similar lifestyles chose.

**"Upgrade Nudge" Feature**  
If a user is close to a higher-value model, a smart pop-up explains: *"For only $X more, you can step up to the [Model], offering better fuel efficiency and more features."* A subtle, ethical upsell opportunity for Toyota.

**Classic Tools, Reimagined**  
- Filter by car type
- Compare trims
- View specs in a simplified, user-friendly design

## How we built it

- **Frontend:** React + Tailwind for a fast, clean, mobile-friendly UI
- **Backend:** Node/Express API to handle questionnaire results, comparisons, and vehicle data
- **AI/ML:** Custom recommendation logic combining lifestyle variables + personality scoring, weighted rankings using a hybrid scoring model
- **Chatbot**: ElevenLabs
- **Data Sources:** Historical maintenance datasets, Toyota specifications, user-generated community reviews

## Challenges we ran into

- Translating subjective lifestyle inputs into objective recommendation scores
- Balancing AI personalization with transparency so users understand why a car matches them
- Creating accurate cost-of-ownership predictions without overwhelming users
- Designing the quiz to feel engaging and human
- Implementing ethical upsell logic that provides value without pressure

## Accomplishments that we're proud of

- Built one of the most personalized Toyota shopping experiences available
- Designed a recommendation engine that understands humans, not just horsepower
- Integrated financial modeling, lifestyle analysis, and sensory preferences into one cohesive system
- Created a user flow that feels like talking to a Toyota expert, not filling out a form

## What we learned

- Car buying is personal process, not just another aspect or consideration thats apart of your life on a day-to-day basis
- AI recommendations work best when they're transparent and relatable
- UX matters—small touches like sliders and personal questions dramatically improve engagement
- The future of automotive shopping is personalization, not static filters

## What's next for Toyota Discover

- AR/VR immersive test drives
- Live chat with Toyota specialists keyed to quiz results
- Real-time dealership inventory integration
- Trade-in value estimator using VIN + AI
- Predictive maintenance insights tailored to recommended vehicles
- Global multilingual rollout
