import { useParams } from "react-router";

function MediaPage() {
    const { id } = useParams();
    return (
        <>{id}</>
    );
}

export default MediaPage;