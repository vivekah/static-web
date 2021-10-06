const validLanguageCodes = [
  'swe'
];

const fundedTranslations = {
  'en': 'funded',
  'swe': 'av målet är uppnått'
}

const seeAllTranslations = {
  'en': 'See All',
  'swe': 'Visa alla'
}
const learnMoreAboutTranslations = {
  'en': 'Learn more about',
  'swe': 'Läs och lär dig mer om'
}

const seeAllImpactTranslations = {
  'en': '',
  'swe': 'Läs mer om effekterna av vårt gemensamma arbete'
}

function translateFunded(lan) {
  let translation = "funded"

  if (lan && validLanguageCodes.includes(lan))
    translation = fundedTranslations[lan]
  return translation
}

function translateSeeAll(lan) {
  let translation = "See All"

  if (lan && validLanguageCodes.includes(lan))
    translation = seeAllTranslations[lan]
  return translation
}

function translateLearnMoreAbout(lan){
    let translation = "Learn more about"

  if (lan && validLanguageCodes.includes(lan))
    translation = learnMoreAboutTranslations[lan]
  return translation
}

function translateSeeAllImpact(lan){
    let translation = "Learn more about"

  if (lan && validLanguageCodes.includes(lan))
    translation = seeAllImpactTranslations[lan]
  return translation
}

export default {
  translateFunded,
  translateSeeAll,
  translateLearnMoreAbout,
  translateSeeAllImpact
}