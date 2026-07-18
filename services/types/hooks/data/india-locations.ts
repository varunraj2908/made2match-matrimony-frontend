// All Indian States / UTs and their districts
// Districts for Kerala are fully listed; other states list major cities/districts.

export const INDIA_STATES: string[] = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// All 14 districts of Kerala
export const KERALA_DISTRICTS: string[] = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
];

// Major districts / cities per state. Kerala uses its full district list.
export const STATE_CITIES: Record<string, string[]> = {
  "Andaman & Nicobar Islands": ["Port Blair", "Car Nicobar", "Diglipur", "Rangat", "Mayabunder"],
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool",
    "Tirupati", "Rajahmundry", "Kadapa", "Kakinada", "Anantapur",
    "Eluru", "Ongole", "Nandyal", "Chittoor", "Srikakulam",
  ],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Along", "Bomdila"],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon",
    "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Karimganj",
  ],
  "Bihar": [
    "Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga",
    "Arrah", "Begusarai", "Katihar", "Munger", "Purnia",
    "Samastipur", "Chapra", "Sitamarhi", "Hajipur", "Bihar Sharif",
  ],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg",
    "Rajnandgaon", "Jagdalpur", "Raigarh", "Ambikapur",
  ],
  "Dadra & Nagar Haveli and Daman & Diu": ["Silvassa", "Daman", "Diu"],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
    "North East Delhi", "North West Delhi", "Shahdara",
    "South Delhi", "South East Delhi", "South West Delhi", "West Delhi",
  ],
  "Goa": ["North Goa", "South Goa", "Panaji", "Vasco da Gama", "Margao", "Mapusa"],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
    "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Mehsana",
    "Morbi", "Navsari", "Bharuch", "Amreli", "Kutch",
  ],
  "Haryana": [
    "Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar",
    "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula",
    "Bhiwani", "Sirsa", "Rewari", "Jhajjar",
  ],
  "Himachal Pradesh": [
    "Shimla", "Solan", "Dharamshala", "Mandi", "Kullu",
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Lahaul & Spiti", "Sirmaur", "Una",
  ],
  "Jammu & Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Pulwama",
    "Kupwara", "Shopian", "Kulgam", "Ganderbal", "Bandipora",
    "Poonch", "Rajouri", "Udhampur", "Doda", "Kathua", "Kishtwar", "Ramban", "Reasi", "Samba",
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar",
    "Hazaribagh", "Giridih", "Ramgarh", "Palamu", "Gumla", "Dumka", "Chaibasa",
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi",
    "Kalaburagi", "Ballari", "Tumakuru", "Davanagere", "Shivamogga",
    "Vijayapura", "Udupi", "Dharwad", "Bidar", "Hassan",
    "Raichur", "Chitradurga", "Bagalkot", "Yadgir", "Koppal",
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad",
  ],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Minicoy"],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain",
    "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
    "Katni", "Singrauli", "Burhanpur", "Chhindwara", "Morena",
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik",
    "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded",
    "Sangli", "Jalgaon", "Akola", "Latur", "Chandrapur",
    "Dhule", "Ahmednagar", "Satara", "Ratnagiri", "Osmanabad",
  ],
  "Manipur": ["Imphal", "Bishnupur", "Thoubal", "Churachandpur", "Ukhrul", "Senapati", "Tamenglong"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur",
    "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda",
    "Koraput", "Angul", "Dhenkanal", "Kendujhar",
  ],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda",
    "Hoshiarpur", "Mohali", "Pathankot", "Moga", "Firozpur",
    "Fatehgarh Sahib", "Gurdaspur", "Kapurthala", "Rupnagar", "Sangrur",
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer",
    "Udaipur", "Bhilwara", "Alwar", "Sri Ganganagar", "Sikar",
    "Barmer", "Nagaur", "Chittorgarh", "Jhunjhunu", "Pali",
  ],
  "Sikkim": ["Gangtok", "Namchi", "Mangan", "Gyalshing"],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem",
    "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul",
    "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam",
    "Hosur", "Nagercoil", "Kanchipuram", "Kumbakonam", "Tirupur",
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar",
    "Ramagundam", "Mahabubnagar", "Nalgonda", "Adilabad", "Suryapet",
    "Miryalaguda", "Mancherial", "Siddipet", "Jagtial",
  ],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Ambassa"],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj",
    "Ghaziabad", "Noida", "Meerut", "Bareilly", "Aligarh",
    "Moradabad", "Saharanpur", "Gorakhpur", "Firozabad", "Jhansi",
    "Mathura", "Muzaffarnagar", "Rampur", "Shahjahanpur", "Farrukhabad",
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Kashipur",
    "Rudrapur", "Rishikesh", "Mussoorie", "Nainital", "Almora",
    "Pithoragarh", "Bageshwar", "Chamoli", "Tehri",
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri",
    "Bardhaman", "Malda", "Baharampur", "Habra", "Jalpaiguri",
    "Kharagpur", "Darjeeling", "Cooch Behar", "Bankura", "Purulia",
  ],
};

/** Returns the city/district list for a given state, or [] if none found. */
export function getCitiesForState(state: string): string[] {
  return STATE_CITIES[state] ?? [];
}
