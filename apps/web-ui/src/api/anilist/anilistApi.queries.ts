export const MediaInfoQuery = `
query MediaInfoQuery($idIn: [Int], $sort: [MediaSort], $perPage: Int) {
  Page(perPage: $perPage) {
    media(id_in: $idIn, sort: $sort) {
      id
      title {
        english,
        native,
        romaji,
        userPreferred
      }
      coverImage {
        extraLarge
      }
      bannerImage
      averageScore
      genres
      siteUrl
      studios {
        nodes {
          name
        }
      }
      startDate {
        month
        year
        day
      }
      type
    }
  }
}
`;

export const CharactersQuery = `
query Characters($idIn: [Int]) {
  Page {
    characters(id_in: $idIn) {
      id
      favourites
      image {
        medium
      }
      name {
        userPreferred
      }
    }
  }
}
`;

export const MediaListWithUsersQuery = `
query MediaList($idIn: [Int], $mediaId: Int, $format: ScoreFormat) {
  Page {
    mediaList(userId_in: $idIn, mediaId: $mediaId) {
      score(format: $format)
      notes
      user {
        avatar {
          medium
        }
        name
        siteUrl
        id
      }
    }
  }
}
`;