variable "aws_region" {
	description = "AWS region for deployment"
	type = string
	default = "ap-southeast-1"
}

variable "environment" {
	description = "Deployment environment"
	type = string
	default = "dev"
}

variable "project_name" {
	description = "Name of the project"
	type = string
	default = "prompt-engineer-agent"
}
