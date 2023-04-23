import React, { useState, useEffect } from "react";
import "../styles/RecruiterHome.css";
import CreateJobModal from "../components/CreateJobModal";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

function RecruiterHome() {
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [shouldFetchJobs, setShouldFetchJobs] = useState(false);
  const [hasJobs, setHasJobs] = useState(false);

  useEffect(() => {
    if (shouldFetchJobs) {
      fetchJobs();
    }
  }, [shouldFetchJobs]);

  const showModal = () => {
    setShowCreateJobModal(true);
  };

  const closeModal = () => {
    setShowCreateJobModal(false);
    setShouldFetchJobs(true);
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "https://chapi.techstartucalgary.com/jobs/me",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      if (response.status === 404) {
        setJobs([]);
        setHasJobs(false);
      } else {
        const data = await response.json();
        setJobs(data);
        setHasJobs(true);
      }
      setShouldFetchJobs(false);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(
        `https://chapi.techstartucalgary.com/jobs/${jobId}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      if (response.status === 200) {
        // Remove the job from the jobs state
        const updatedJobs = jobs.filter((job) => job.id !== jobId);
        setJobs(updatedJobs);
        if (updatedJobs.length === 0) {
          setHasJobs(false);
        }
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  };

  return (
    <Box className="appHome">
      <Button className="Button" onClick={showModal}>
        <Typography>Post New Job</Typography>
      </Button>

      <Container className="row" sx={{ marginTop: "20px" }}>
        <Typography>Your Job Listings</Typography>
      </Container>

      {hasJobs ? (
        <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
          <Grid container spacing={2}>
            {jobs.map((job) => (
              <Grid item xs={12} md={6} key={job.id}>
                <Card className="jobContainer">
                  <CardContent className="CardContent">
                    <Typography
                      className="jobTitle"
                      variant="h5"
                      component="div"
                    >
                      {job.title}
                    </Typography>
                    <Typography
                      className="jobCompany"
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                    >
                      {job.owner.company}
                    </Typography>
                    <Typography
                      className="jobLocation"
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                    >
                      {job.location}
                    </Typography>
                    {job.min_salary > 0 && job.max_salary > 0 && (
                      <Typography
                        className="jobSalary"
                        sx={{ mb: 1.5 }}
                        color="text.secondary"
                      >
                        {formatCurrency(job.min_salary)} -{" "}
                        {formatCurrency(job.max_salary)}
                      </Typography>
                    )}

                    {job?.description && (
                      <div className="descContainer">
                        <Typography className="jobDescription">
                          {job.description}
                        </Typography>
                      </div>
                    )}
                    {job.skills.map((skill) => {
                      return (
                        <Typography
                          className="jobSkill"
                          key={skill.id}
                          sx={{ mt: 1 }}
                        >
                          {skill.skill}
                        </Typography>
                      );
                    })}
                    <Button
                      variant="contained"
                      className="applyButton"
                      onClick={() => deleteJob(job.id)}
                    >
                      <Typography>Delete Job</Typography>
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography className="noJobs">
          You haven't posted any jobs yet.
        </Typography>
      )}

      <CreateJobModal open={showCreateJobModal} closeModal={closeModal} />
    </Box>
  );
}

export default RecruiterHome;