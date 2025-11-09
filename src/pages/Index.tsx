import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/CarCard";
import { CarFilters } from "@/components/CarFilters";
import { cars } from "@/data/cars";
import heroImage from "@/assets/hero-car.jpg";
import { ChevronRight, Shield, Zap, Award, DollarSign, MessageSquare, Sparkles, MessageCircle, X, RefreshCw, Mic, MicOff } from "lucide-react";


const Index = () => {
 const [search, setSearch] = useState("");
 const [selectedType, setSelectedType] = useState("all");
 const [selectedBrand, setSelectedBrand] = useState("all");
  // Voice chat state
 const [isListening, setIsListening] = useState(false);
 const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  // AI Recommender State
 const [showAIRecommender, setShowAIRecommender] = useState(false);
 const [messages, setMessages] = useState([]);
 const [input, setInput] = useState('');
 const [conversationStep, setConversationStep] = useState(0);
 const [hasGivenRecommendations, setHasGivenRecommendations] = useState(false);
 const [userProfile, setUserProfile] = useState({
   familySize: null,
   hasPets: false,
   commute: null,
   lifestyle: [],
   budget: null,
   lifeEvents: []
 });


 const filteredCars = useMemo(() => {
   return cars.filter((car) => {
     const matchesSearch =
       search === "" ||
       car.brand.toLowerCase().includes(search.toLowerCase()) ||
       car.model.toLowerCase().includes(search.toLowerCase());
    
     const matchesType = selectedType === "all" || car.type === selectedType;
    
     const matchesBrand = selectedBrand === "all" || car.model.toLowerCase() === selectedBrand.toLowerCase();


     return matchesSearch && matchesType && matchesBrand;
   });
 }, [search, selectedType, selectedBrand]);


 const featuredCar = cars.find((car) => car.featured);


 // Keyword-based recommendation logic
 const analyzeUserInput = (text) => {
   const lowerText = text.toLowerCase();
   const profile = { ...userProfile };


   // Family size detection
   if (lowerText.match(/\b(single|alone|just me)\b/)) profile.familySize = 1;
   if (lowerText.match(/\b(couple|two of us|partner)\b/)) profile.familySize = 2;
   if (lowerText.match(/\b(3|three|family of 3)\b/)) profile.familySize = 3;
   if (lowerText.match(/\b(4|four|family of 4)\b/)) profile.familySize = 4;
   if (lowerText.match(/\b(5|five|family of 5)\b/)) profile.familySize = 5;
   if (lowerText.match(/\b(6|six|7|seven|8|eight|large family)\b/)) profile.familySize = 6;
  
   // Kids detection
   if (lowerText.match(/\b(kids|children|toddler|teenager|baby|babies)\b/)) {
     if (!profile.lifestyle.includes('family')) profile.lifestyle.push('family');
   }


   // Pets detection
   if (lowerText.match(/\b(dog|cat|pet)\b/)) profile.hasPets = true;


   // Commute detection
   if (lowerText.match(/\b(short|city|urban|downtown)\b/)) profile.commute = 'short';
   if (lowerText.match(/\b(long|highway|hour|miles)\b/)) profile.commute = 'long';


   // Lifestyle detection
   if (lowerText.match(/\b(camping|outdoors|off-road|adventure|hiking|trail)\b/)) {
     if (!profile.lifestyle.includes('adventure')) profile.lifestyle.push('adventure');
   }
   if (lowerText.match(/\b(road trip|travel|vacation|distance)\b/)) {
     if (!profile.lifestyle.includes('roadtrip')) profile.lifestyle.push('roadtrip');
   }
   if (lowerText.match(/\b(haul|tow|truck|cargo|equipment|trailer)\b/)) {
     if (!profile.lifestyle.includes('hauling')) profile.lifestyle.push('hauling');
   }
   if (lowerText.match(/\b(sport|soccer|baseball|hockey|equipment)\b/)) {
     if (!profile.lifestyle.includes('sports')) profile.lifestyle.push('sports');
   }
   if (lowerText.match(/\b(eco|environment|green|hybrid|electric|fuel)\b/)) {
     if (!profile.lifestyle.includes('eco')) profile.lifestyle.push('eco');
   }
   if (lowerText.match(/\b(luxury|premium|comfort|nice|upscale)\b/)) {
     if (!profile.lifestyle.includes('luxury')) profile.lifestyle.push('luxury');
   }
   if (lowerText.match(/\b(performance|fast|sporty|fun|driving)\b/)) {
     if (!profile.lifestyle.includes('performance')) profile.lifestyle.push('performance');
   }


   // Life events
   if (lowerText.match(/\b(baby|pregnant|expecting)\b/)) {
     if (!profile.lifeEvents.includes('newbaby')) profile.lifeEvents.push('newbaby');
   }
   if (lowerText.match(/\b(retire|retirement|retired)\b/)) {
     if (!profile.lifeEvents.includes('retirement')) profile.lifeEvents.push('retirement');
   }
   if (lowerText.match(/\b(college|teenager learning|new driver)\b/)) {
     if (!profile.lifeEvents.includes('teensdriving')) profile.lifeEvents.push('teensdriving');
   }


   // Budget detection
   if (lowerText.match(/\b(budget|affordable|cheap|economical|save money)\b/)) profile.budget = 'low';
   if (lowerText.match(/\b(mid-range|moderate|reasonable)\b/)) profile.budget = 'mid';
   if (lowerText.match(/\b(luxury|premium|high-end|money is not)\b/)) profile.budget = 'high';


   return profile;
 };


 const generateRecommendations = (profile) => {
   const recommendations = [];
   const reasons = [];


   // Score each vehicle based on profile
   const vehicleScores = {
     corolla: 0,
     camry: 0,
     prius: 0,
     rav4: 0,
     highlander: 0,
     '4runner': 0,
     sienna: 0,
     tacoma: 0,
     tundra: 0,
     crown: 0,
     gr: 0
   };


   // Family size scoring
   if (profile.familySize) {
     if (profile.familySize === 1 || profile.familySize === 2) {
       vehicleScores.corolla += 3;
       vehicleScores.camry += 2;
       vehicleScores.prius += 3;
       vehicleScores.gr += 2;
     } else if (profile.familySize === 3 || profile.familySize === 4) {
       vehicleScores.camry += 3;
       vehicleScores.rav4 += 4;
       vehicleScores.highlander += 3;
     } else if (profile.familySize >= 5) {
       vehicleScores.highlander += 4;
       vehicleScores.sienna += 5;
     }
   }


   // Pets scoring
   if (profile.hasPets) {
     vehicleScores.rav4 += 2;
     vehicleScores.highlander += 2;
     vehicleScores['4runner'] += 2;
     vehicleScores.sienna += 1;
   }


   // Commute scoring
   if (profile.commute === 'short') {
     vehicleScores.corolla += 2;
     vehicleScores.prius += 3;
     vehicleScores.camry += 1;
   } else if (profile.commute === 'long') {
     vehicleScores.camry += 3;
     vehicleScores.prius += 3;
     vehicleScores.rav4 += 2;
   }


   // Lifestyle scoring
   profile.lifestyle.forEach(lifestyle => {
     if (lifestyle === 'adventure') {
       vehicleScores['4runner'] += 5;
       vehicleScores.tacoma += 4;
       vehicleScores.rav4 += 2;
       reasons.push("off-road capability and rugged build");
     }
     if (lifestyle === 'roadtrip') {
       vehicleScores.highlander += 3;
       vehicleScores.sienna += 3;
       vehicleScores.camry += 2;
       reasons.push("comfortable long-distance cruising");
     }
     if (lifestyle === 'hauling') {
       vehicleScores.tacoma += 5;
       vehicleScores.tundra += 5;
       vehicleScores['4runner'] += 2;
       reasons.push("towing and cargo capacity");
     }
     if (lifestyle === 'sports') {
       vehicleScores.rav4 += 3;
       vehicleScores.highlander += 4;
       vehicleScores.sienna += 3;
       reasons.push("cargo space for sports equipment");
     }
     if (lifestyle === 'eco') {
       vehicleScores.prius += 5;
       vehicleScores.rav4 += 2;
       vehicleScores.camry += 2;
       vehicleScores.crown += 2;
       vehicleScores.sienna += 2;
       reasons.push("excellent fuel efficiency and hybrid options");
     }
     if (lifestyle === 'luxury') {
       vehicleScores.crown += 5;
       vehicleScores.highlander += 2;
       vehicleScores.camry += 2;
       reasons.push("premium features and comfort");
     }
     if (lifestyle === 'performance') {
       vehicleScores.gr += 5;
       vehicleScores.camry += 1;
       reasons.push("sporty handling and driving dynamics");
     }
     if (lifestyle === 'family') {
       vehicleScores.sienna += 3;
       vehicleScores.highlander += 3;
       vehicleScores.rav4 += 2;
       reasons.push("family-friendly features and space");
     }
   });


   // Life events scoring
   profile.lifeEvents.forEach(event => {
     if (event === 'newbaby') {
       vehicleScores.sienna += 4;
       vehicleScores.highlander += 3;
       vehicleScores.rav4 += 2;
       reasons.push("easy access and safety features for young children");
     }
     if (event === 'retirement') {
       vehicleScores.camry += 3;
       vehicleScores.crown += 4;
       vehicleScores.rav4 += 2;
       reasons.push("comfort and reliability");
     }
     if (event === 'teensdriving') {
       vehicleScores.corolla += 4;
       vehicleScores.camry += 3;
       reasons.push("safety features and affordable to insure");
     }
   });


   // Budget adjustments
   if (profile.budget === 'low') {
     vehicleScores.corolla += 2;
     vehicleScores.prius += 1;
     reasons.push("excellent value and low cost of ownership");
   } else if (profile.budget === 'high') {
     vehicleScores.crown += 3;
     vehicleScores.tundra += 1;
     vehicleScores['4runner'] += 1;
   }


   // Convert scores to recommendations
   const sortedVehicles = Object.entries(vehicleScores)
     .sort(([, a], [, b]) => b - a)
     .slice(0, 3);


   const vehicleInfo = {
     corolla: { name: "Corolla", desc: "Compact sedan with excellent reliability and fuel economy", price: "$22,000" },
     camry: { name: "Camry", desc: "Midsize sedan perfect for daily commutes and family needs", price: "$27,000" },
     prius: { name: "Prius", desc: "Hybrid sedan with best-in-class fuel efficiency", price: "$28,000" },
     rav4: { name: "RAV4", desc: "Versatile compact SUV available in hybrid", price: "$29,000" },
     highlander: { name: "Highlander", desc: "3-row midsize SUV seating up to 8 passengers", price: "$38,000" },
     '4runner': { name: "4Runner", desc: "Rugged SUV built for adventure and off-roading", price: "$42,000" },
     sienna: { name: "Sienna", desc: "Hybrid minivan with ultimate family versatility", price: "$37,000" },
     tacoma: { name: "Tacoma", desc: "Midsize truck for work and weekend adventures", price: "$31,000" },
     tundra: { name: "Tundra", desc: "Full-size truck with serious towing capability", price: "$40,000" },
     crown: { name: "Crown", desc: "Luxury hybrid sedan with premium comfort", price: "$41,000" },
     gr: { name: "GR Corolla / GR86 / Supra", desc: "Performance vehicles for driving enthusiasts", price: "$30,000+" }
   };


   sortedVehicles.forEach(([vehicle, score]) => {
     if (score > 0) {
       recommendations.push(vehicleInfo[vehicle]);
     }
   });


   return { recommendations, reasons: [...new Set(reasons)] };
 };


 const getNextQuestion = (step, profile) => {
   const questions = [
     "Hi! I'm here to help you find the perfect Toyota for your lifestyle. Let's start simple:\n\n**Tell me about your household:**\n• How many people typically ride with you?\n• Do you have any pets?\n• Any major life changes coming up (like a baby on the way, kids learning to drive, retirement)?",
    
     "Great! Now let's talk about your daily driving:\n\n**Your commute and routine:**\n• How long is your typical commute?\n• Do you drive mostly in the city or on highways?\n• Do you take frequent road trips?",
    
     "Almost there! Last question:\n\n**Your lifestyle and activities:**\n• What do you do on weekends? (camping, sports, hauling stuff, etc.)\n• Any special needs? (towing, off-roading, fuel efficiency, luxury features)\n• What matters most to you in a vehicle?"
   ];


   return questions[step] || questions[0];
 };


 const handleAISubmit = () => {
   if (!input.trim()) return;


   const userMessage = input.trim();
   setInput('');
  
   // Add user message
   setMessages(prev => [...prev, { role: 'user', content: userMessage }]);


   // Analyze user input and update profile
   const updatedProfile = analyzeUserInput(userMessage);
   setUserProfile(updatedProfile);


   // Check what information we have
   const hasBasicInfo =
     updatedProfile.familySize !== null ||
     updatedProfile.commute !== null ||
     updatedProfile.lifestyle.length > 0 ||
     updatedProfile.lifeEvents.length > 0;


   // Check if we have substantial information to make recommendations
   const infoCount =
     (updatedProfile.familySize !== null ? 1 : 0) +
     (updatedProfile.commute !== null ? 1 : 0) +
     updatedProfile.lifestyle.length +
     updatedProfile.lifeEvents.length +
     (updatedProfile.budget !== null ? 1 : 0);


   const hasEnoughInfo = infoCount >= 2; // Need at least 2 pieces of information


   setTimeout(() => {
     // If already gave recommendations, provide contextual follow-up
     if (hasGivenRecommendations) {
       const lowerMessage = userMessage.toLowerCase();
      
       // Check if asking about specific vehicle
       if (lowerMessage.includes('highlander')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "Great choice! The **Highlander** is perfect for your needs. Key features:\n\n• **Seating**: 3 rows, seats up to 8 passengers\n• **Cargo**: 16 cu ft behind 3rd row, expands to 84 cu ft with seats folded\n• **Towing**: Up to 5,000 lbs capacity\n• **Safety**: Toyota Safety Sense 2.5+ standard (pre-collision, lane departure, adaptive cruise)\n• **Hybrid Option**: Available - gets 36 MPG combined\n• **AWD**: Available for all-weather capability\n\nThe Highlander is Toyota's best-selling 3-row SUV, known for reliability and family-friendly features. Starting at $38,000. Want to know about specific trims or compare it with another vehicle?"
         }]);
         return;
       } else if (lowerMessage.includes('rav4')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **RAV4** is an excellent choice! Here's why:\n\n• **Compact but spacious**: Easier to park and maneuver\n• **Cargo**: 37 cu ft behind rear seats, expands to 69 cu ft\n• **Hybrid available**: RAV4 Hybrid gets 40+ MPG combined\n• **AWD standard**: Great for all weather conditions\n• **Reliability**: One of Toyota's most dependable vehicles\n• **Safety**: Toyota Safety Sense 2.0 standard\n\nIt's more affordable than the Highlander at $29,000 starting price. The RAV4 Hybrid is especially popular for its incredible fuel economy. Perfect size for most families! Want to know about trims or compare with other vehicles?"
         }]);
         return;
       } else if (lowerMessage.includes('sienna')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Sienna** is the ultimate family vehicle! Here's what makes it special:\n\n• **Easy access**: Power sliding doors on both sides (perfect for tight parking lots)\n• **All-Hybrid**: Every Sienna is hybrid - 36 MPG combined\n• **Space**: Most cargo room in the lineup, seats 7 or 8\n• **Flexibility**: Second-row captain's chairs or bench seating\n• **Entertainment**: Available rear-seat entertainment system\n• **Safety**: Toyota Safety Sense 2.0 standard\n• **Towing**: Up to 3,500 lbs capacity\n\nStarting at $37,000. Many families love the Sienna because the sliding doors make loading kids and cargo incredibly easy. The hybrid powertrain saves a lot on gas too! Want details on trims or comparisons?"
         }]);
         return;
       } else if (lowerMessage.includes('prius')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "Excellent choice! The **Prius** is the fuel economy champion:\n\n• **Fuel Economy**: Up to 57 MPG city, 56 MPG highway, 57 combined - best in class!\n• **Cost Savings**: Save approximately $1,000+ per year on gas vs regular sedan\n• **Reliability**: Known for lasting 200,000+ miles with minimal maintenance\n• **Technology**: Advanced hybrid system, smooth and quiet\n• **Safety**: Toyota Safety Sense 2.5 standard\n• **Cargo**: 27 cu ft of cargo space (seats fold flat)\n• **Low Maintenance**: Regenerative braking means brake pads last longer\n\nStarting at $28,000. For your 45-minute highway commute, the Prius is perfect - incredibly efficient and comfortable for long drives. The hybrid system is proven (Toyota has been making Prius since 1997!). Want to know about trims or compare with the Camry?"
         }]);
         return;
       } else if (lowerMessage.includes('camry')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Camry** is Toyota's best-selling sedan for good reason:\n\n• **Fuel Economy**: 32 MPG combined (gas), or 52 MPG with Hybrid option\n• **Comfort**: Spacious, quiet cabin - perfect for highway commutes\n• **Reliability**: Legendary Toyota dependability\n• **Value**: Excellent resale value and low cost of ownership\n• **Safety**: Toyota Safety Sense 2.5+ standard\n• **Cargo**: 15 cu ft trunk space\n• **Power**: Available with 2.5L (203 hp) or 3.5L V6 (301 hp)\n\nStarting at $27,000. The Camry Hybrid would be perfect for your needs - almost as efficient as the Prius but with more traditional sedan styling and a bit more space. Great highway cruiser! Want details on trims or comparisons?"
         }]);
         return;
       } else if (lowerMessage.includes('corolla')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Corolla** is Toyota's most affordable and dependable option:\n\n• **Fuel Economy**: 35 MPG combined (gas), or 53 MPG with Hybrid\n• **Affordability**: Starting at just $22,000\n• **Reliability**: One of the most reliable cars ever made\n• **Low Insurance**: Affordable to insure\n• **Safety**: Toyota Safety Sense 2.0 standard\n• **Compact**: Easy to park and maneuver\n• **Maintenance**: Very low cost of ownership\n\nThe Corolla is perfect for budget-conscious buyers who want reliability. The Corolla Hybrid gets incredible gas mileage - close to the Prius but at a lower price point. It's smaller than the Camry but still comfortable for highway driving. Want to know more about trims?"
         }]);
         return;
       } else if (lowerMessage.includes('4runner')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **4Runner** is Toyota's rugged adventure SUV:\n\n• **Off-Road**: Body-on-frame construction, serious off-road capability\n• **Towing**: Up to 5,000 lbs towing capacity\n• **Durability**: Built to last in tough conditions\n• **Cargo**: 47 cu ft behind 2nd row, 89 cu ft total\n• **Seating**: 5 or 7-passenger options\n• **4WD**: Available with advanced 4WD systems\n• **Reliability**: Known to last 300,000+ miles\n\nStarting at $42,000. The 4Runner is for serious adventurers - camping, trails, towing. It's less fuel-efficient than other SUVs (17 MPG combined) but unmatched in capability. Want to compare with RAV4 or Highlander?"
         }]);
         return;
       } else if (lowerMessage.includes('tacoma')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Tacoma** is Toyota's legendary midsize truck:\n\n• **Towing**: Up to 6,800 lbs towing capacity\n• **Off-Road**: TRD Off-Road and Pro trims are trail-ready\n• **Bed Options**: 5-foot or 6-foot bed lengths\n• **Reliability**: Known for incredible longevity and resale value\n• **4WD**: Available with advanced 4WD systems\n• **Payload**: Up to 1,685 lbs payload capacity\n• **Durability**: Body-on-frame construction\n\nStarting at $31,000. The Tacoma is perfect for outdoor enthusiasts, contractors, and anyone who needs a capable truck. Excellent for work and weekend adventures. Want details on trims (SR, SR5, TRD) or compare with Tundra?"
         }]);
         return;
       } else if (lowerMessage.includes('tundra')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Tundra** is Toyota's full-size powerhouse truck:\n\n• **Towing**: Up to 12,000 lbs towing capacity with i-FORCE MAX hybrid\n• **Power**: 389 hp twin-turbo V6 (standard) or 437 hp hybrid\n• **Payload**: Up to 1,940 lbs payload capacity\n• **Bed Options**: 5.5-foot, 6.5-foot, or 8.1-foot beds\n• **Technology**: New generation with modern tech features\n• **Capability**: Built for serious work and heavy towing\n• **Hybrid Option**: i-FORCE MAX adds power and efficiency\n\nStarting at $40,000. The Tundra is for those who need maximum capability - contractors, RV towers, serious haulers. The new hybrid system is impressive! Want to compare with Tacoma or learn about trims?"
         }]);
         return;
       } else if (lowerMessage.includes('crown')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "The **Crown** is Toyota's luxury hybrid sedan:\n\n• **Luxury**: Premium materials, upscale cabin\n• **Hybrid**: All-hybrid powertrain - 38 MPG combined\n• **Power**: 236 hp hybrid system (Platinum: 340 hp)\n• **AWD**: Standard all-wheel drive\n• **Technology**: 12.3-inch touchscreen, premium audio\n• **Comfort**: Spacious, quiet, smooth ride\n• **Style**: Distinctive raised sedan design\n\nStarting at $41,000. The Crown blends luxury, efficiency, and style - perfect for those who want premium features with hybrid efficiency. Think of it as a luxurious alternative to the Camry. Want to know about trim levels?"
         }]);
         return;
       } else if (lowerMessage.includes('gr corolla') || lowerMessage.includes('gr86') || lowerMessage.includes('supra') || (lowerMessage.includes('gr ') && lowerMessage.includes('performance'))) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "Toyota's **GR (Gazoo Racing) Performance** lineup:\n\n**GR Corolla** (~$36,000)\n• 300 hp turbocharged 3-cylinder\n• Rally-bred AWD system\n• Manual transmission\n• Daily-drivable hot hatch\n\n**GR86** (~$30,000)\n• 228 hp naturally aspirated boxer engine\n• Rear-wheel drive, perfect balance\n• Lightweight sports car\n• Co-developed with Subaru\n\n**GR Supra** (~$45,000+)\n• 255-382 hp turbocharged engine options\n• BMW-Toyota collaboration\n• Pure sports car experience\n• Legendary nameplate\n\nAll three offer true driver engagement with Toyota reliability. Which one interests you most?"
         }]);
         return;
       } else if (lowerMessage.includes('compare')) {
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "Let me compare your recommended vehicles:\n\n**Prius** ($28k)\n✓ Best fuel economy (57 MPG)\n✓ Lowest operating costs\n✓ Proven hybrid technology\n✗ Smaller than Camry\n✗ Less cargo space\n\n**Camry** ($27k)\n✓ Most affordable starting price\n✓ Spacious and comfortable\n✓ Hybrid available (52 MPG)\n✓ Traditional sedan styling\n✗ Not as efficient as Prius\n\n**RAV4** ($29k)\n✓ SUV versatility and cargo space\n✓ Higher seating position\n✓ Hybrid available (40 MPG)\n✓ AWD standard\n✗ Slightly less efficient on highway\n\n**For your needs** (45-min highway commute, eco-conscious, budget-minded):\n• **Best fuel savings**: Prius\n• **Best value**: Camry\n• **Most versatile**: RAV4\n\nWhich factor matters most to you - maximum efficiency, space, or versatility?"
         }]);
         return;
       }
      
       // If no specific vehicle mentioned, treat as additional information
       const { recommendations, reasons } = generateRecommendations(updatedProfile);
      
       let response = "Thanks for the additional details! That helps me refine my recommendations:\n\n";
      
       recommendations.forEach((rec, idx) => {
         response += `**${idx + 1}. ${rec.name}** (Starting at ${rec.price})\n${rec.desc}\n\n`;
       });


       if (reasons.length > 0) {
         response += "**Updated reasons based on your needs:**\n";
         reasons.forEach(reason => {
           response += `• ${reason.charAt(0).toUpperCase() + reason.slice(1)}\n`;
         });
       }


       response += "\n**Want details?** Ask me about any specific vehicle (e.g., 'Tell me about the Prius'), or ask me to compare them!";


       setMessages(prev => [...prev, { role: 'assistant', content: response }]);
       return;
     }


     if (hasEnoughInfo) {
       // Generate recommendations for first time
       const { recommendations, reasons } = generateRecommendations(updatedProfile);
      
       let response = "Perfect! Based on what you've shared, here are my top Toyota recommendations for you:\n\n";
      
       recommendations.forEach((rec, idx) => {
         response += `**${idx + 1}. ${rec.name}** (Starting at ${rec.price})\n${rec.desc}\n\n`;
       });


       if (reasons.length > 0) {
         response += "**Why these vehicles?**\n";
         reasons.forEach(reason => {
           response += `• ${reason.charAt(0).toUpperCase() + reason.slice(1)}\n`;
         });
       }


       response += "\n**Want to know more?** Ask me about any specific vehicle (e.g., 'Tell me about the Highlander'), ask me to compare them, or share more details about your needs!";


       setMessages(prev => [...prev, { role: 'assistant', content: response }]);
       setHasGivenRecommendations(true);
     } else if (hasBasicInfo) {
       // We have some info but need more - ask a smart follow-up question
       let followUp = "Thanks for sharing! ";
      
       // Ask about what's missing
       if (updatedProfile.familySize === null && updatedProfile.lifeEvents.length === 0) {
         followUp += "Tell me about your household - do you have a family, or is it just you? Any pets or upcoming life changes?";
       } else if (updatedProfile.lifestyle.length === 0 && updatedProfile.commute === null) {
         followUp += "What about your daily routine and activities? Long commute? Weekend adventures? Any hobbies that require cargo space?";
       } else {
         followUp += "Is there anything else important to you? Budget considerations, specific features you need, or activities you do regularly?";
       }
      
       setMessages(prev => [...prev, { role: 'assistant', content: followUp }]);
     } else {
       // No useful info yet - ask next question
       const nextStep = conversationStep + 1;
       setConversationStep(nextStep);
       const nextQuestion = getNextQuestion(Math.min(nextStep, 2), updatedProfile);
       setMessages(prev => [...prev, { role: 'assistant', content: nextQuestion }]);
     }
   }, 500);
 };


 const handleAIReset = () => {
   setMessages([]);
   setConversationStep(0);
   setHasGivenRecommendations(false);
   setUserProfile({
     familySize: null,
     hasPets: false,
     commute: null,
     lifestyle: [],
     budget: null,
     lifeEvents: []
   });
   setInput('');
  
   // Add initial message
   setTimeout(() => {
     const initialQuestion = getNextQuestion(0, {});
     setMessages([{ role: 'assistant', content: initialQuestion }]);
   }, 100);
 };


 const openAIRecommender = () => {
   setShowAIRecommender(true);
   if (messages.length === 0) {
     setTimeout(() => {
       const initialQuestion = getNextQuestion(0, {});
       setMessages([{ role: 'assistant', content: initialQuestion }]);
     }, 100);
   }
 };


 // Voice chat functionality
 const startVoiceChat = async () => {
   if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
     alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
     return;
   }


   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
   const recognition = new SpeechRecognition();
  
   recognition.continuous = false;
   recognition.interimResults = false;
   recognition.lang = 'en-US';


   recognition.onstart = () => {
     setIsListening(true);
   };


   recognition.onresult = async (event) => {
     const transcript = event.results[0][0].transcript;
     setInput(transcript);
     setIsListening(false);
     setIsProcessingVoice(true);


     // Automatically submit the transcribed text
     const userMessage = transcript.trim();
     setMessages(prev => [...prev, { role: 'user', content: userMessage }]);


     // Analyze and generate response
     const updatedProfile = analyzeUserInput(userMessage);
     setUserProfile(updatedProfile);


     const infoCount =
       (updatedProfile.familySize !== null ? 1 : 0) +
       (updatedProfile.commute !== null ? 1 : 0) +
       updatedProfile.lifestyle.length +
       updatedProfile.lifeEvents.length +
       (updatedProfile.budget !== null ? 1 : 0);


     const hasEnoughInfo = infoCount >= 2;


     setTimeout(async () => {
       let responseText = '';


       if (hasGivenRecommendations) {
         const lowerMessage = userMessage.toLowerCase();
        
         // Check for vehicle-specific queries
         if (lowerMessage.includes('highlander')) {
           responseText = "Great choice! The Highlander is perfect for your needs. It seats up to 8 passengers in 3 rows, has up to 84 cubic feet of cargo space, and can tow up to 5,000 pounds. The hybrid option gets 36 MPG combined. Starting at $38,000.";
         } else if (lowerMessage.includes('rav4')) {
           responseText = "The RAV4 is an excellent choice! It's compact but spacious with 69 cubic feet of cargo space when seats are folded. The hybrid gets over 40 MPG combined. All-wheel drive is standard. Starting at $29,000.";
         } else if (lowerMessage.includes('prius')) {
           responseText = "Excellent choice! The Prius gets up to 57 MPG combined - best in class! It's incredibly reliable, saving you about $1,000 per year on gas. Starting at $28,000.";
         } else if (lowerMessage.includes('compare')) {
           responseText = "Let me compare your options. The Prius has the best fuel economy at 57 MPG. The Camry is the most affordable starting at $27,000. The RAV4 offers the most versatility with SUV cargo space and AWD.";
         } else {
           const { recommendations } = generateRecommendations(updatedProfile);
           responseText = `Based on your additional details, here are my top recommendations: ${recommendations.map((r, i) => `${i + 1}. ${r.name} starting at ${r.price}`).join('. ')}. Ask me about any specific vehicle for details!`;
         }
       } else if (hasEnoughInfo) {
         const { recommendations, reasons } = generateRecommendations(updatedProfile);
         responseText = `Perfect! Here are my top Toyota recommendations: ${recommendations.map((r, i) => `${i + 1}. ${r.name} starting at ${r.price}, ${r.desc}`).join('. ')}. ${reasons.length > 0 ? 'These match your needs for ' + reasons.join(', ') + '.' : ''} Ask me about any vehicle for more details!`;
         setHasGivenRecommendations(true);
       } else {
         responseText = "Thanks for sharing! To give you better recommendations, can you tell me more about your household size, daily commute, or activities you enjoy?";
       }


       setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);


       // Speak the response using ElevenLabs
       try {
         const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'xi-api-key': 'sk_be1a8cf1a39a89556ae20457fd7b3a030911a9289bc47f6a' // User needs to add their key
           },
           body: JSON.stringify({
             text: responseText,
             model_id: 'eleven_flash_v2_5',
             voice_settings: {
               stability: 0.5,
               similarity_boost: 0.75
             }
           })
         });


         if (response.ok) {
           const audioBlob = await response.blob();
           const audioUrl = URL.createObjectURL(audioBlob);
           const audio = new Audio(audioUrl);
           audio.play();
         }
       } catch (error) {
         console.log('Text-to-speech unavailable:', error);
       }


       setIsProcessingVoice(false);
       setInput('');
     }, 500);
   };


   recognition.onerror = (event) => {
     console.error('Speech recognition error:', event.error);
     setIsListening(false);
     setIsProcessingVoice(false);
     alert('Voice recognition error. Please try again.');
   };


   recognition.onend = () => {
     setIsListening(false);
   };


   recognition.start();
 };


 return (
   <div className="min-h-screen bg-background">
     {/* Navigation */}
     <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between h-16">
           <h1 className="text-3xl font-bold text-primary tracking-tight">
             TOYOTA
           </h1>
           <div className="flex items-center gap-6">
             <Button variant="ghost" className="hidden md:inline-flex">Vehicles</Button>
             <Button variant="ghost" className="hidden md:inline-flex">Shopping Tools</Button>
             <Button variant="ghost" className="hidden md:inline-flex">Owners</Button>
             <Link to="/reviews">
               <Button variant="ghost" className="hidden md:inline-flex">
                 <MessageSquare className="w-4 h-4 mr-2" />
                 Reviews
               </Button>
             </Link>
             <Link to="/matching">
               <Button variant="ghost" className="hidden md:inline-flex">
                 <Sparkles className="w-4 h-4 mr-2" />
                 Personalized Match
               </Button>
             </Link>
             <Link to="/financial">
               <Button variant="ghost" className="hidden md:inline-flex">
                 <DollarSign className="w-4 h-4 mr-2" />
                 Financing
               </Button>
             </Link>
             <Button variant="default">Find a Dealer</Button>
           </div>
         </div>
       </div>
     </nav>


     {/* Hero Section */}
     <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-16">
       <div className="absolute inset-0">
         <img
           src={heroImage}
           alt="Toyota vehicles"
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
       </div>
      
       <div className="relative z-10 container mx-auto px-4 animate-fade-in">
         <div className="max-w-2xl">
           <p className="text-primary font-semibold mb-4 text-lg">Welcome to Toyota</p>
           <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
             Let's Go Places
           </h2>
           <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
             Discover the perfect Toyota for your journey. From fuel-efficient sedans to rugged SUVs,
             we have a vehicle that fits your lifestyle.
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
             <Button variant="hero" size="lg" className="text-lg">
               View All Vehicles
               <ChevronRight className="w-5 h-5" />
             </Button>
             <Button variant="outline" size="lg" className="text-lg border-2">
               Build & Price
             </Button>
           </div>
         </div>
       </div>


       {/* Featured Car Info */}
       {featuredCar && (
         <div className="absolute bottom-8 right-8 bg-card backdrop-blur-sm border-2 border-primary/20 rounded-lg p-6 max-w-sm animate-slide-up shadow-card hidden lg:block">
           <p className="text-sm text-muted-foreground mb-1">Featured Model</p>
           <h3 className="text-2xl font-bold text-foreground mb-1">
             2024 {featuredCar.model}
           </h3>
           <p className="text-xl text-primary font-semibold mb-3">
             Starting at ${featuredCar.price.toLocaleString()}
           </p>
           <Button variant="outline" size="sm" className="w-full">
             Learn More
           </Button>
         </div>
       )}
     </section>


     {/* Why Toyota Section */}
     <section className="py-16 bg-muted">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="text-center p-6">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
               <Shield className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-2">Reliability</h3>
             <p className="text-muted-foreground">
               Trusted quality and dependability in every vehicle we build
             </p>
           </div>
           <div className="text-center p-6">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
               <Zap className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-2">Innovation</h3>
             <p className="text-muted-foreground">
               Leading the way in hybrid and electric vehicle technology
             </p>
           </div>
           <div className="text-center p-6">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
               <Award className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-bold text-foreground mb-2">Value</h3>
             <p className="text-muted-foreground">
               Exceptional resale value and low cost of ownership
             </p>
           </div>
         </div>
       </div>
     </section>


     {/* AI Recommender CTA Section */}
     <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card rounded-2xl p-8 shadow-lg border-2 border-primary/20">
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-6 h-6 text-primary" />
               <span className="text-sm font-semibold text-primary uppercase tracking-wide">AI-Powered</span>
             </div>
             <h3 className="text-3xl font-bold text-foreground mb-3">
               Not Sure Which Toyota Is Right for You?
             </h3>
             <p className="text-lg text-muted-foreground mb-4">
               Our AI Lifestyle Advisor asks about your daily life, family, and future plans to recommend
               the perfect Toyota—based on how you actually live, not just specs.
             </p>
             <ul className="space-y-2 text-muted-foreground">
               <li className="flex items-center gap-2">
                 <ChevronRight className="w-4 h-4 text-primary" />
                 <span>Personalized recommendations in minutes</span>
               </li>
               <li className="flex items-center gap-2">
                 <ChevronRight className="w-4 h-4 text-primary" />
                 <span>No pressure, just helpful guidance</span>
               </li>
               <li className="flex items-center gap-2">
                 <ChevronRight className="w-4 h-4 text-primary" />
                 <span>Considers your lifestyle, not just budget</span>
               </li>
             </ul>
           </div>
           <div className="flex-shrink-0">
             <Button
               size="lg"
               className="text-lg px-8 py-6"
               onClick={openAIRecommender}
             >
               <MessageCircle className="w-5 h-5 mr-2" />
               Start AI Advisor
             </Button>
           </div>
         </div>
       </div>
     </section>


     {/* Car Catalog Section */}
     <section className="py-20 px-4 sm:px-6 lg:px-8">
       <div className="container mx-auto">
         <div className="text-center mb-12 animate-fade-in">
           <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
             Explore Our Lineup
           </h2>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             Find the perfect Toyota vehicle to match your needs and budget
           </p>
         </div>


         <CarFilters
           search={search}
           onSearchChange={setSearch}
           selectedType={selectedType}
           onTypeChange={setSelectedType}
           selectedBrand={selectedBrand}
           onBrandChange={setSelectedBrand}
         />


         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredCars.map((car, index) => (
             <div
               key={car.id}
               className="animate-fade-in"
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               <CarCard car={car} />
             </div>
           ))}
         </div>


         {filteredCars.length === 0 && (
           <div className="text-center py-16">
             <p className="text-xl text-muted-foreground">
               No vehicles match your criteria. Try adjusting your filters.
             </p>
           </div>
         )}
       </div>
     </section>


     {/* CTA Section */}
     <section className="py-20 bg-gradient-hero text-primary-foreground">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-4xl md:text-5xl font-bold mb-6">
           Ready to Get Started?
         </h2>
         <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
           Visit your local Toyota dealer today for a test drive or explore our inventory online
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button variant="secondary" size="lg" className="text-lg">
             Find a Dealer
           </Button>
           <Button variant="outline" size="lg" className="text-lg border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
             Request a Quote
           </Button>
         </div>
       </div>
     </section>


     {/* Footer */}
     <footer className="bg-card border-t border-border py-12">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
           <div>
             <h3 className="text-2xl font-bold text-primary mb-4">
               TOYOTA
             </h3>
             <p className="text-muted-foreground">
               Start Your Impossible
             </p>
           </div>
           <div>
             <h4 className="font-semibold text-foreground mb-4">Shop</h4>
             <ul className="space-y-2 text-muted-foreground">
               <li className="hover:text-primary cursor-pointer transition-colors">All Vehicles</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Hybrid & Electric</li>
               <li className="hover:text-primary cursor-pointer transition-colors">SUVs & Trucks</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Cars & Minivans</li>
             </ul>
           </div>
           <div>
             <h4 className="font-semibold text-foreground mb-4">Owners</h4>
             <ul className="space-y-2 text-muted-foreground">
               <li className="hover:text-primary cursor-pointer transition-colors">Owner Resources</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Service & Parts</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Recalls & Campaigns</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Warranty</li>
             </ul>
           </div>
           <div>
             <h4 className="font-semibold text-foreground mb-4">Support</h4>
             <ul className="space-y-2 text-muted-foreground">
               <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Find a Dealer</li>
               <li className="hover:text-primary cursor-pointer transition-colors">FAQs</li>
               <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
             </ul>
           </div>
         </div>
         <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
           <p>&copy; 2024 Toyota Motor Corporation. All rights reserved.</p>
           <p className="mt-2">Privacy Policy | Terms of Use | Legal</p>
         </div>
       </div>
     </footer>


     {/* AI Recommender Modal */}
     {showAIRecommender && (
       <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
         <div className="bg-card rounded-2xl shadow-2xl border-2 border-primary/20 w-full max-w-4xl h-[85vh] flex flex-col">
           {/* Modal Header */}
           <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-2xl">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <MessageCircle className="w-6 h-6 text-primary" />
                 <h3 className="text-2xl font-bold text-foreground">Toyota AI Lifestyle Advisor</h3>
               </div>
               <p className="text-sm text-muted-foreground flex items-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 Get personalized vehicle recommendations based on your lifestyle
               </p>
             </div>
             <button
               onClick={() => setShowAIRecommender(false)}
               className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
             >
               <X className="w-6 h-6" />
             </button>
           </div>


           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {messages.map((msg, idx) => (
               <div
                 key={idx}
                 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div
                   className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                     msg.role === 'user'
                       ? 'bg-primary text-primary-foreground rounded-br-sm'
                       : 'bg-muted text-foreground rounded-bl-sm'
                   }`}
                 >
                   {msg.role === 'assistant' && (
                     <div className="flex items-center gap-2 mb-2 text-primary">
                       <MessageCircle className="w-4 h-4" />
                       <span className="text-xs font-semibold">AI Advisor</span>
                     </div>
                   )}
                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
                     {msg.content.split('\n').map((line, i) => {
                       if (line.includes('**')) {
                         const parts = line.split('**');
                         return (
                           <p key={i} className="mb-2">
                             {parts.map((part, j) =>
                               j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                             )}
                           </p>
                         );
                       }
                       if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                         return <p key={i} className="ml-2 mb-1">{line}</p>;
                       }
                       return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                     })}
                   </div>
                 </div>
               </div>
             ))}
           </div>


           {/* Input Area */}
           <div className="border-t border-border p-4 bg-muted/30">
             <div className="flex gap-2">
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleAISubmit();
                   }
                 }}
                 placeholder="Share your lifestyle details..."
                 className="flex-1 px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                 disabled={isListening || isProcessingVoice}
               />
               <Button
                 onClick={startVoiceChat}
                 disabled={isListening || isProcessingVoice}
                 variant={isListening ? "default" : "outline"}
                 className={`px-4 ${isListening ? 'animate-pulse' : ''}`}
                 title={isListening ? "Listening..." : "Speak to AI"}
               >
                 {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
               </Button>
               <Button
                 onClick={handleAISubmit}
                 disabled={!input.trim() || isListening || isProcessingVoice}
                 className="px-6"
               >
                 {isProcessingVoice ? 'Processing...' : 'Send'}
               </Button>
               <Button
                 onClick={handleAIReset}
                 variant="outline"
                 className="px-4"
                 title="Start over"
                 disabled={isListening || isProcessingVoice}
               >
                 <RefreshCw className="w-5 h-5" />
               </Button>
             </div>
             {isListening && (
               <p className="text-sm text-primary mt-2 text-center animate-pulse">
                 🎤 Listening... Speak now
               </p>
             )}
             {isProcessingVoice && (
               <p className="text-sm text-muted-foreground mt-2 text-center">
                 Processing your voice input...
               </p>
             )}
           </div>
         </div>
       </div>
     )}
   </div>
 );
};


export default Index;