/** Fail publishing if a storefront declaration returns in served HTML. */
export function assertAppointmentOnlyMarkup(html: string, label: string): void {
  if (/BeautySalon|openingHoursSpecification/i.test(html)) {
    throw new Error(`${label}: salon or shop-hours markup is not permitted for Carnival Glam Hub.`);
  }
}