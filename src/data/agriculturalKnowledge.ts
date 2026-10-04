import { KnowledgeItem, KnowledgeCitation } from '../types';

export const initialKnowledgeBase: KnowledgeItem[] = [
  // 1. TOMATO EARLY BLIGHT
  {
    id: 'kb_dis_01',
    type: 'disease',
    name: 'Early Blight of Tomato & Potato',
    scientificName: 'Alternaria solani',
    cropsAffected: ['Tomato', 'Potato', 'Eggplant', 'Pepper'],
    symptoms: [
      'Dark brown to black necrotic spots with characteristic concentric target rings',
      'Chlorotic yellow halos surrounding older lesions on lower leaves',
      'Premature defoliation starting from the bottom of the plant canopy upward',
      'Dark, sunken, leathery lesions at the stem end of developing fruit',
    ],
    causesOrBiology:
      'Caused by the necrotrophic fungus Alternaria solani. The fungus overwinters in crop debris, solanaceous weeds, and can be seed-borne.',
    transmissionOrLifeCycle:
      'Conidia (spores) are dispersed by wind, splashing rain, overhead irrigation water, and farm equipment.',
    favorableConditions:
      'Warm temperatures (24°C–29°C) accompanied by heavy dews, frequent rainfall, or relative humidity above 80%.',
    prevention: [
      'Practice 3-year crop rotation away from solanaceous species (tomatoes, potatoes, eggplants, peppers).',
      'Space plants 50–60 cm apart with vertical staking and trellising to enhance canopy ventilation.',
      'Apply clean organic straw or polythene mulch to prevent soil-borne spores from splashing onto lower leaves.',
      'Remove and safely burn or bury infected lower leaves immediately upon symptom emergence.',
    ],
    management: [
      'Prune the lower 30 cm of foliage as the plant matures to prevent contact with damp soil.',
      'Use drip irrigation at the base rather than overhead sprinkler watering.',
      'Inspect fields twice weekly during warm humid periods.',
    ],
    organicControls: [
      'Copper octanoate or Bordeaux mixture (copper sulfate + slaked lime) applied early in the morning.',
      'Biofungicides containing Bacillus subtilis (e.g., Serenade) or Trichoderma harzianum.',
    ],
    chemicalControls: [
      'Contact fungicides: Mancozeb (75% WP) or Chlorothalonil.',
      'Systemic fungicides: Azoxystrobin + Difenoconazole applied at initial disease onset; observe a 3-day Pre-Harvest Interval (PHI).',
    ],
    sources: [
      {
        organization: 'CABI Plantwise Knowledge Bank',
        title: 'Early Blight of Tomato (Alternaria solani) Technical Factsheet',
        url: 'https://www.plantwise.org/knowledgebank/datasheet/4500',
        snippet: 'Target-like spots on leaves surrounded by yellow chlorotic halo. Widespread in tropical East Africa.',
        year: '2023',
      },
      {
        organization: 'FAO (Food and Agriculture Organization)',
        title: 'Integrated Pest Management for Solanaceous Crops in Sub-Saharan Africa',
        url: 'https://www.fao.org/agriculture/crops/thematic-sitemap/theme/pests/ipm/en/',
        snippet: 'Cultural sanitation combined with copper-based protectants provides 80%+ yield protection.',
        year: '2021',
      },
      {
        organization: 'NARO Uganda (National Agricultural Research Organisation)',
        title: 'Horticulture Pathogen Advisory: Alternaria Management in Central & Western Uganda',
        snippet: 'Severe early blight occurs in greenhouse and open-field tomato production in Wakiso and Mpigi.',
        year: '2024',
      },
    ],
    geographicRelevance: 'East Africa / Uganda & Sub-Saharan Tropics',
    verificationStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
  },

  // 2. BANANA BACTERIAL WILT (BXW)
  {
    id: 'kb_dis_02',
    type: 'disease',
    name: 'Banana Bacterial Wilt (BXW)',
    scientificName: 'Xanthomonas vasicola pv. musacearum',
    cropsAffected: ['Banana (Matooke)', 'Plantain', 'Ensete', 'Dessert Banana'],
    symptoms: [
      'Progressive yellowing and wilting of leaves resembling drought stress, even with adequate soil moisture',
      'Premature uneven ripening and internal brown rotting of banana fruit fingers',
      'Wilting and blackening of the male floral bud (empumumpu)',
      'Yellowish or brown bacterial ooze emerging from cut pseudostems within 10–15 minutes',
    ],
    causesOrBiology:
      'Vascular bacterial infection caused by Xanthomonas vasicola pv. musacearum clogging plant xylem vessels.',
    transmissionOrLifeCycle:
      'Transmitted primarily by insect vectors visiting male flowers (bees, fruit flies), contaminated pruning panga knives, and infected sucker planting material.',
    favorableConditions:
      'Warm humid periods with high insect foraging activity; continuous cutting of leaves without knife sterilization.',
    prevention: [
      'Debudding: Remove the male bud using a forked stick (not a knife) immediately after the last fruit hand forms.',
      'Sterilize all cutting tools with household bleach (1:5 dilution) or open fire between stools.',
      'Only source planting suckers from certified disease-free tissue culture laboratories or certified clean mother blocks.',
    ],
    management: [
      'Single Diseased Stem Removal (SDSR): Cut only the visibly affected pseudostem at ground level to save the remaining stool.',
      'Uproot entirely devastated mats and leave soil fallow or plant non-host crops for at least 6 months.',
    ],
    organicControls: ['Strict phytosanitation, flame tool sterilization, and botanical wood ash application.'],
    chemicalControls: ['No effective chemical cure exists; management relies strictly on biosecurity and clean tools.'],
    sources: [
      {
        organization: 'CGIAR / IITA (International Institute of Tropical Agriculture)',
        title: 'Single Diseased Stem Removal (SDSR) for BXW Control in East and Central Africa',
        url: 'https://www.iita.org/research/banana-bacterial-wilt/',
        snippet: 'SDSR reduces labour by 80% while restoring banana grove yields within 3 to 6 months.',
        year: '2022',
      },
      {
        organization: 'NARO Uganda & Ministry of Agriculture (MAAIF)',
        title: 'Standard Operating Procedures for Banana Bacterial Wilt Containment',
        snippet: 'Enforced nationwide in Uganda to safeguard food security of highland cooking banana (Matooke).',
        year: '2023',
      },
    ],
    geographicRelevance: 'Uganda, Rwanda, DR Congo, Kenya, Tanzania',
    verificationStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },

  // 3. FALL ARMYWORM
  {
    id: 'kb_pst_01',
    type: 'pest',
    name: 'Fall Armyworm (FAW)',
    scientificName: 'Spodoptera frugiperda',
    cropsAffected: ['Maize', 'Sorghum', 'Rice', 'Sugarcane', 'Millet', 'Pasture Grasses'],
    symptoms: [
      'Translucent "windowpane" patches on leaf whorls caused by young larvae scraping epidermal tissue',
      'Ragged irregular holes across expanding maize foliage',
      'Abundant yellowish-brown moist frass (sawdust-like excrement) accumulating inside the central whorl',
      'Larva features an inverted "Y" suture on the dark head capsule and four elevated black pinacula on the eighth abdominal segment',
    ],
    causesOrBiology:
      'Nocturnal moth Spodoptera frugiperda with rapid life cycles (24–30 days in warm tropical climates). Female moths lay 1,000–1,500 eggs.',
    transmissionOrLifeCycle:
      'Adults are strong fliers carried over hundreds of kilometers on prevailing storm wind fronts.',
    favorableConditions:
      'Warm temperatures (25°C–32°C) and sporadic dry spells during the early vegetative crop stage.',
    prevention: [
      'Plant immediately at the onset of seasonal rains to establish vigorous crops before moth populations peak.',
      'Intercrop maize with companion legumes using the Push-Pull strategy (Desmodium greenleaf repels moths, Napier grass traps them).',
      'Avoid staggered late planting within the same farming zone.',
    ],
    management: [
      'Scout 20 consecutive plants in 5 field locations weekly; take action if 20% of vegetative whorls show live feeding.',
      'Direct hand collection and crushing of egg masses and large caterpillars on smallholder plots.',
    ],
    organicControls: [
      'Pour fine dry wood ash, sand, or biochar directly into the central whorls to desiccate young caterpillars.',
      'Neem seed kernel extract (NSKE 5%) or cold-pressed neem oil (5 ml/L) sprayed in late afternoon.',
      'Bacillus thuringiensis subsp. kurstaki (Bt) bioinsecticide.',
    ],
    chemicalControls: [
      'Emamectin Benzoate (5% SG) or Chlorantraniliprole (20% SC) applied with nozzle directed directly down into the whorl.',
      'Rotate chemical classes to prevent rapid pesticide resistance buildup.',
    ],
    sources: [
      {
        organization: 'FAO (Food and Agriculture Organization)',
        title: 'Global Action for Fall Armyworm Control - Technical Guidance',
        url: 'https://www.fao.org/fall-armyworm/en/',
        snippet: 'Biological control and habitat management form the cornerstone of sustainable smallholder maize protection.',
        year: '2023',
      },
      {
        organization: 'CABI Plantwise',
        title: 'Pest Management Decision Guide: Fall Armyworm on Maize in Africa',
        snippet: 'Early detection at V2–V6 whorl stage is critical to prevent tassel and cob destruction.',
        year: '2022',
      },
      {
        organization: 'NARO Uganda / NaCRRI Namulonge',
        title: 'Cereal Entomology Bulletin: Integrated FAW Management for Ugandan Smallholders',
        snippet: 'Ash application and push-pull intercropping demonstrated up to 70% infestation reduction in field trials.',
        year: '2024',
      },
    ],
    geographicRelevance: 'Sub-Saharan Africa, Tropical Americas, Asia',
    verificationStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-12T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },

  // 4. COFFEE LEAF RUST
  {
    id: 'kb_dis_03',
    type: 'disease',
    name: 'Coffee Leaf Rust (CLR)',
    scientificName: 'Hemileia vastatrix',
    cropsAffected: ['Coffee (Arabica & Robusta)'],
    symptoms: [
      'Powdery orange-yellow pustules on the lower (abaxial) leaf surface',
      'Pale yellow chlorotic circular spots visible on the upper leaf surface directly above rust pustules',
      'Severe premature defoliation leading to branch dieback and biennial bearing collapse',
    ],
    causesOrBiology:
      'Obligate biotrophic fungus Hemileia vastatrix infecting coffee foliage through leaf stomata on the underside.',
    transmissionOrLifeCycle:
      'Urediniospores are dispersed by rain splash, wind turbulence, and harvesting laborers brushing foliage.',
    favorableConditions:
      'Temperatures between 21°C and 25°C, high relative humidity (>85%), and presence of free water on leaf surfaces for 4–6 hours.',
    prevention: [
      'Prune shade canopies to allow morning sunshine and wind movement across coffee bushes.',
      'Plant rust-resistant cultivars (e.g., NARO Robusta Wilt/Rust resistant clones, Arabica Ruiru 11, Batian).',
      'Maintain balanced tree nutrition with adequate potassium to bolster leaf cuticle thickness.',
    ],
    management: [
      'Regular pruning of dead, diseased twigs and unwanted sucker water shoots.',
      'Scout bottom and middle canopy leaves monthly, particularly following rainy periods.',
    ],
    organicControls: [
      'Preventative copper oxychloride (50% WP) or Bordeaux mixture sprayed before seasonal heavy rains begin.',
    ],
    chemicalControls: [
      'Systemic triazole fungicides (e.g., Cyproconazole, Triadimefon, or Pyraclostrobin) applied during peak sporulation.',
    ],
    sources: [
      {
        organization: 'Uganda Coffee Development Authority (UCDA)',
        title: 'Good Agricultural Practices for Sustainable Coffee Farming in Uganda',
        url: 'https://ugandacoffee.go.ug/',
        snippet: 'CLR causes 30-50% yield reduction in Arabica zones around Mt. Elgon and Rwenzori when untreated.',
        year: '2023',
      },
      {
        organization: 'CABI Crop Protection Compendium',
        title: 'Hemileia vastatrix (coffee leaf rust) Comprehensive Datasheet',
        year: '2022',
      },
    ],
    geographicRelevance: 'East Africa, Central & South America, Global Coffee Belts',
    verificationStatus: 'Verified',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    createdAt: '2025-01-14T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },

  // 5. NITROGEN DEFICIENCY
  {
    id: 'kb_nut_01',
    type: 'nutrient_deficiency',
    name: 'Nitrogen (N) Deficiency',
    cropsAffected: ['Maize', 'Tomato', 'Banana', 'Rice', 'Cassava', 'Vegetables', 'All Crops'],
    symptoms: [
      'General pale light-green to yellowing (chlorosis) beginning on older, lower leaves',
      'In maize, chlorosis creates a classic "V-shaped" yellowing progressing down the leaf midrib towards the stem',
      'Stunted plant height, thin spindly stems, and reduced tillering or branch development',
      'Premature senescence of lower canopy leaves as mobile nitrogen is remobilized to young shoot tips',
    ],
    causesOrBiology:
      'Insufficient available soil ammonium (NH4+) or nitrate (NO3-). Commonly caused by heavy rainfall leaching, sandy soil texture, or low organic matter.',
    favorableConditions:
      'Sandy, shallow soils; excessive rainfall or over-irrigation causing leaching; waterlogged anaerobic soils causing denitrification.',
    prevention: [
      'Incorporate 5–10 tonnes/hectare of well-decomposed farmyard manure or compost prior to planting.',
      'Practice crop rotation and green manuring with nitrogen-fixing legumes (Mucuna, Crotalaria, Beans, Groundnuts).',
      'Split nitrogen fertilizer applications rather than applying everything at once.',
    ],
    management: [
      'Top-dress with Urea (46% N) or CAN (Calcium Ammonium Nitrate 27% N) into moist soil around the plant drip line.',
      'Foliar spray with 1–2% soluble urea solution or organic fish hydrolysate for rapid acute symptom recovery.',
    ],
    sources: [
      {
        organization: 'FAO (Food and Agriculture Organization)',
        title: 'Guide to Fertilizer and Plant Nutrition Management',
        snippet: 'Nitrogen is the most mobile nutrient in the plant; deficiency invariably manifests on the oldest bottom leaves first.',
        year: '2021',
      },
      {
        organization: 'USDA Agricultural Research Service',
        title: 'Visual Diagnosis of Plant Nutrient Deficiencies',
        year: '2020',
      },
    ],
    geographicRelevance: 'Universal / Global Tropical Soils',
    verificationStatus: 'Verified',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },

  // 6. POTASSIUM DEFICIENCY
  {
    id: 'kb_nut_02',
    type: 'nutrient_deficiency',
    name: 'Potassium (K) Deficiency',
    cropsAffected: ['Banana', 'Tomato', 'Potato', 'Maize', 'Coffee', 'Cassava'],
    symptoms: [
      'Marginal leaf scorch: yellowing followed by dry brown necrosis along the outer margins and tips of mature leaves',
      'In banana, leaves turn golden yellow and fold rapidly downward along the midrib',
      'Weak stems prone to lodging (falling over in wind), poor fruit filling, and uneven ripening in tomatoes',
      'Increased susceptibility to fungal diseases and drought stress',
    ],
    causesOrBiology:
      'Lack of plant-available potassium (K+). High-yielding crops (such as bananas and tomatoes) have immense potassium uptake demands.',
    favorableConditions:
      'Highly weathered acid soils, leached sandy soils, or excessive magnesium/calcium competing for root exchange sites.',
    prevention: [
      'Heavy organic mulching using crop residues, coffee husks, or banana pseudostems rich in potassium.',
      'Soil test analysis every 2 seasons to determine exchangeable potassium levels.',
    ],
    management: [
      'Side-dress with Muriate of Potash (MOP / KCl) or Sulfate of Potash (SOP / K2SO4).',
      'Apply clean wood ash into soil or compost heaps as an economical organic potassium source.',
    ],
    sources: [
      {
        organization: 'CGIAR / IITA',
        title: 'Banana Nutrition and Soil Fertility Guidelines for East African Highland Cooking Bananas',
        snippet: 'Bananas extract up to 400 kg/ha of K2O annually; mulch recycling is mandatory to prevent grove depletion.',
        year: '2022',
      },
      {
        organization: 'Plantwise Knowledge Bank',
        title: 'Nutrient Deficiency Guide: Potassium',
        year: '2023',
      },
    ],
    geographicRelevance: 'East Africa & Tropical High-Rainfall Soils',
    verificationStatus: 'Verified',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },

  // 7. CALCIUM DEFICIENCY (BLOSSOM END ROT)
  {
    id: 'kb_nut_03',
    type: 'nutrient_deficiency',
    name: 'Calcium Deficiency & Blossom End Rot (BER)',
    cropsAffected: ['Tomato', 'Pepper', 'Eggplant', 'Watermelon'],
    symptoms: [
      'Water-soaked dark lesion appearing at the blossom end (distal tip) of green fruit',
      'Lesion expands into a flat or sunken, leathery black patch as the fruit expands',
      'Young leaf margins may curl downward and exhibit light marginal chlorosis',
    ],
    causesOrBiology:
      'Localized physiological calcium (Ca2+) deficiency in developing fruit tissue. Calcium travels passively with water transpiration; erratic watering starves expanding fruit cells.',
    favorableConditions:
      'Fluctuating soil moisture (dry spell followed by heavy irrigation), high greenhouse temperatures, or excessive ammonium nitrogen.',
    prevention: [
      'Maintain consistent, even soil moisture through scheduled drip irrigation and organic mulching.',
      'Incorporate agricultural lime or gypsum into acid soils before transplanting.',
      'Avoid high-ammonium fertilizers during fruit enlargement; use nitrate-nitrogen instead.',
    ],
    management: [
      'Apply foliar spray of soluble Calcium Chloride or Calcium Nitrate (0.5% concentration) to flower and fruit clusters.',
      'Remove affected green fruits immediately so the plant redirects calcium to new setting clusters.',
    ],
    sources: [
      {
        organization: 'FAO (Food and Agriculture Organization)',
        title: 'Good Agricultural Practices for Greenhouse Vegetable Production in the Tropics',
        snippet: 'Blossom End Rot is primarily an irrigation uniformity disorder rather than an absolute soil calcium shortage.',
        year: '2021',
      },
      {
        organization: 'NARO Uganda / Horticulture Division',
        title: 'Preventing Fruit Disorders in Commercial Tomato Production',
        year: '2023',
      },
    ],
    geographicRelevance: 'Global / Greenhouse & Open-Field Vegetables',
    verificationStatus: 'Verified',
    createdAt: '2025-01-16T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },

  // 8. TUTA ABSOLUTA (TOMATO LEAFMINER)
  {
    id: 'kb_pst_02',
    type: 'pest',
    name: 'Tomato Leafminer (Tuta absoluta)',
    scientificName: 'Phthorimaea absoluta / Tuta absoluta',
    cropsAffected: ['Tomato', 'Potato', 'Eggplant', 'Nightshades'],
    symptoms: [
      'Blotch-like translucent mines/galleries inside leaf mesophyll containing visible dark frass specks',
      'Pin-holes and burrowing galleries in green and ripe tomato fruit stems and calyx',
      'Young stems mined leading to wilting of vegetative shoots',
    ],
    causesOrBiology:
      'Gelechiid micro-moth whose larvae feed inside plant leaf tissue, shielded from superficial contact sprays.',
    transmissionOrLifeCycle:
      'High reproductive capacity with up to 10–12 generations per year in warm climates; eggs hatch in 4–5 days.',
    favorableConditions:
      'Warm and dry climate; continuous greenhouse tomato production without host-free breaks.',
    prevention: [
      'Install insect-proof netting (minimum 40 mesh) on greenhouse vents and doorways.',
      'Place pheromone water traps or delta sticky traps (4–8 traps/ha) for early male moth monitoring.',
      'Destroy crop residues and solanaceous weeds (e.g. Solanum incanum) surrounding the fields.',
    ],
    management: [
      'Introduce predatory mirid bugs (Nesidiocoris tenuis) or parasitic wasps.',
      'Hand-pick and squash mined leaves during early infestation.',
    ],
    organicControls: [
      'Spinosad bio-insecticide (fermentation product of Saccharopolyspora spinosa).',
      'Neem seed kernel extract or azadirachtin sprayed at egg hatching.',
    ],
    chemicalControls: [
      'Chlorantraniliprole, Flubendiamide, or Indoxacarb rotated systematically to avoid resistance.',
    ],
    sources: [
      {
        organization: 'CABI Plantwise Knowledge Bank',
        title: 'Tuta absoluta (Tomato Leafminer) Datasheet and Management Manual',
        url: 'https://www.cabi.org/tuta',
        snippet: 'A devastating invasive pest in Africa causing up to 100% crop loss in unprotected tomato plantations.',
        year: '2023',
      },
      {
        organization: 'NARO Uganda & MAAIF',
        title: 'Emerging Invasive Pests: Tuta absoluta Management Factsheet',
        snippet: 'Mass trapping with pheromone lures provides reliable regional population suppression.',
        year: '2022',
      },
    ],
    geographicRelevance: 'East Africa, Mediterranean, South America, Global Tropics',
    verificationStatus: 'Verified',
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2026-02-18T00:00:00.000Z',
  },
];

/**
 * Searches the verified agricultural knowledge repository.
 */
export function searchKnowledge(
  query: string,
  cropFilter?: string,
  categoryFilter?: string
): KnowledgeItem[] {
  const q = query.trim().toLowerCase();

  return initialKnowledgeBase.filter((item) => {
    // Category filter
    if (categoryFilter && categoryFilter !== 'all' && item.type !== categoryFilter) {
      return false;
    }

    // Crop filter
    if (cropFilter && cropFilter !== 'all') {
      const matchesCrop = item.cropsAffected.some((c) =>
        c.toLowerCase().includes(cropFilter.toLowerCase())
      );
      if (!matchesCrop) return false;
    }

    // Text search
    if (!q) return true;

    const inName = item.name.toLowerCase().includes(q);
    const inScientific = item.scientificName?.toLowerCase().includes(q);
    const inCrops = item.cropsAffected.some((c) => c.toLowerCase().includes(q));
    const inSymptoms = item.symptoms.some((s) => s.toLowerCase().includes(q));
    const inCauses = item.causesOrBiology.toLowerCase().includes(q);
    const inSources = item.sources.some(
      (src) =>
        src.organization.toLowerCase().includes(q) ||
        src.title.toLowerCase().includes(q)
    );

    return inName || inScientific || inCrops || inSymptoms || inCauses || inSources;
  });
}
