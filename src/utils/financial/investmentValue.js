const calculateInvestmentOutcomeToTwoDecimals = (
  amount,
  currentPostValue,
  postValueAtTimeOfInvestment
) => {
  const investmentOutcome =
    (currentPostValue / postValueAtTimeOfInvestment) * amount
  const roundedInvestmentOutcome = Math.round(investmentOutcome * 100) / 100
  return roundedInvestmentOutcome
}

const calculatePercentageReturnToTwoDecimals = (amount, investmentOutcome) => {
  const percentageReturn = (investmentOutcome / amount) * 100
  const roundedPercentageReturn = Math.round(percentageReturn * 100) / 100
  return roundedPercentageReturn
}

module.exports = {
  calculateInvestmentOutcomeToTwoDecimals,
  calculatePercentageReturnToTwoDecimals,
}
