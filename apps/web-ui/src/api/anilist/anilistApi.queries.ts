export const MediaInfoQuery = `
query MediaInfoQuery($idIn: [Int], $sort: [MediaSort]) {
  Page {
    media(id_in: $idIn, sort: $sort) {
      id,
      idMal,
      title {
        english,
        native,
      },
      coverImage {
        extraLarge
      },
      bannerImage,
      averageScore,
      siteUrl,
      studios {
        nodes {
          name
        }
      },
      startDate {
        month
        year
      }
    }
  }
}
`;