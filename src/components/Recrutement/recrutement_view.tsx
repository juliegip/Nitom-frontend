import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PlaceIcon from "@mui/icons-material/Place";
import ShareIcon from "@mui/icons-material/Share";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import Loading from "@/components/Loading/Loading";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReactMarkdown from "react-markdown";
import STG from "@/assets/Bases/STG.jpg";
import { Helmet } from "react-helmet";
import { LazyLoadImage } from "react-lazy-load-image-component";
import transition from "@/theme/transition";

const RecrutementView = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [recrutement, setRecrutement] = useState<any>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecrutement = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_BACKEND
          }/api/recrutements/${id}?populate=photo`
        );
        setRecrutement(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Erreur lors du chargement des offres de recrutement");
      } finally {
        setLoading(false);
      }
    };
    fetchRecrutement();
  }, [id]);

  if (loading) return <Loading open={loading} />;
  if (error)
    return (
      <Typography variant="h3" color="error">
        {error}
      </Typography>
    );

  if (!recrutement) {
    return <CircularProgress color="secondary" />;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: recrutement.attributes.job_title,
          text: "Regardez cette offre de recrutement !",
          url: window.location.href,
        })
        .catch((error) => console.log("Erreur de partage", error));
    } else {
      alert("Votre navigateur ne supporte pas la fonction de partage");
    }
  };

  return (
    <>
      <Helmet>
        <title>{recrutement.attributes.job_title} - Motin SAS</title>
        <meta
          name="description"
          content="Découvrez nos offres de recrutement"
        />
        <meta property="og:title" content={recrutement.attributes.job_title} />
        <meta
          property="og:description"
          content={recrutement.attributes.content}
        />
        <meta
          property="og:image"
          content={`${import.meta.env.VITE_APP_BACKEND}${
            recrutement.attributes.photo.data.attributes.formats.medium?.url ||
            recrutement.attributes.photo.data.attributes.url
          }`}
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta
          property="article:published_time"
          content={recrutement.attributes.createdAt}
        />
      </Helmet>
      <Loading open={loading} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <Button
          variant="contained"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => window.history.back()}
          sx={{ alignSelf: "flex-start", mt: "2rem", ml: "2rem" }}
        >
          Retour
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 3,
              width: { xs: "100%", sm: "70%" },
            }}
          >
            <Typography variant="h1" sx={{ textAlign: "left", ml: 2, mb: 2 }}>
              {recrutement.attributes.job_title}
            </Typography>

            {recrutement.attributes.photo.data && (
              <LazyLoadImage
                src={`${import.meta.env.VITE_APP_BACKEND}${
                  recrutement.attributes.photo.data.attributes.formats.medium
                    ?.url || recrutement.attributes.photo.data.attributes.url
                }`}
                alt="photo actualité"
                style={{ width: "100%", height: "auto", padding: "1rem" }}
              />
            )}

            {!recrutement.attributes.photo.data && (
              <LazyLoadImage
                src={STG}
                alt="photo actualité"
                style={{ width: "100%", height: "auto", padding: "1rem" }}
              />
            )}

            {recrutement.attributes.contract_type && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  border: "1px solid lightgray",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "lightgray",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    width: "150px",
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: "1.5rem" }} />
                  <Typography variant="body1" sx={{ textAlign: "left" }}>
                    Contrat
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "left", mb: 1, ml: 2 }}
                >
                  {recrutement.attributes.contract_type}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                ml: 2,
                border: "1px solid lightgray",
                borderTop: "none",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "lightgray",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  width: "150px",
                }}
              >
                <PlaceIcon sx={{ fontSize: "1.5rem" }} />
                <Typography variant="body1" sx={{ textAlign: "left" }}>
                  Lieu
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ textAlign: "left", mb: 1, ml: 2 }}
              >
                {recrutement.attributes.job_location}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ ml: 2 }}>
              <ReactMarkdown>{recrutement.attributes.content}</ReactMarkdown>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 3,
              width: { xs: "100%", sm: "30%" },
              mt: { xs: 3, sm: 0 },
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "left", mb: 2 }}>
              Contact
            </Typography>

            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ContactPhoneIcon sx={{ fontSize: "1.5rem", color: "#c71121" }} />
              <Typography variant="body1" sx={{ display: "inline", ml: 1 }}>
                Personne à contacter : {recrutement.attributes.contact}
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<ShareIcon />}
          onClick={handleShare}
          sx={{ ml: "2rem", mb: "2rem", alignSelf: "center" }}
        >
          Partager
        </Button>
      </Box>
    </>
  );
};

export default transition(RecrutementView);
