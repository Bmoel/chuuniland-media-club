import { Box, Chip, Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import Section from "./Section";

type GenreFilterProps = {
    genreFrequency: { genre: string; count: number }[];
    selectedGenre: string | null;
    onGenreClick: (genre: string) => void;
};

function GenreFilter({ genreFrequency, selectedGenre, onGenreClick }: GenreFilterProps) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleButton = (
        <IconButton size="small" onClick={() => setCollapsed(prev => !prev)} aria-label={collapsed ? "Expand genres" : "Collapse genres"}>
            {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
    );

    return (
        <Section title="Genres" headerAction={toggleButton}>
            <Collapse in={!collapsed}>
                <Box display="flex" flexWrap="wrap" gap={1}>
                    {genreFrequency.map(({ genre, count }) => {
                        const isSelected = selectedGenre === genre;
                        return (
                            <Chip
                                key={genre}
                                label={`${genre} (${count})`}
                                variant={isSelected ? "filled" : "outlined"}
                                color={isSelected ? "primary" : "default"}
                                size="small"
                                onClick={() => onGenreClick(genre)}
                                clickable
                            />
                        );
                    })}
                </Box>
            </Collapse>
        </Section>
    );
}

export default GenreFilter;
