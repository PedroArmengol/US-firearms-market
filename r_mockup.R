rm(list=ls())

#Script to create the firearms smuggling platform

library("geocode")
library("RCurl")
library("RJSONIO")
library("plyr")
library("maptools")
library("stringr")
library("devtools")
library("extrafont")
library("ggthemes")
library("readr")
library("haven")
library("dplyr")
library("tidyr")
library("stringr")
library("ggplot2")
library("plyr")
library("ggrepel")
library("grid")
library("gridExtra")
library("gdata") 
library("readxl")
library("scales")
library("gtable")
library("ggmap")

# IDEAS
#Do visualizations by license types

# Import data
# 2014
setwd("/Users/pedro/Documents/DataVis/Final_Project_D3/license_data")
jun_2014 = read.xls("jun_2014.xls")
jun_2015 = read.xls("jun_2015.xlsx")
jun_2016 = read.xls("jun_2016.xlsx")
jun_2017 = read.xls("jun_2017.xlsx")

#Clean
jun_2014 <- jun_2014[-1,]
jun_2014$year = 2014
jun_2015 <- jun_2015[-1,]
jun_2015$year = 2015
jun_2016 <- jun_2016[-1,]
jun_2016$year = 2016
jun_2017 <- jun_2017[-1,]
jun_2017$year = 2017
#Small sample to geo-code
jun_2014_sample = sample_n(jun_2014, 1000)
jun_2015_sample = sample_n(jun_2015, 1000)
jun_2016_sample = sample_n(jun_2016, 1000)
jun_2017_sample = sample_n(jun_2017, 1000)

#Create addresses
attach(jun_2014_sample)
jun_2014_sample$address <- paste(Business.Name,",",Premise.Street,",",Premise.City,",",Premise.State)
jun_2014_sample$address[Business.Name == "NULL"] <- paste(Premise.Street[Business.Name == "NULL"],",",Premise.City[Business.Name == "NULL"],",",Premise.State[Business.Name == "NULL"])
detach(jun_2014_sample)

attach(jun_2015_sample)
jun_2015_sample$address <- paste(Business.Name,",",Premise.Street,",",Premise.City,",",Premise.State)
jun_2015_sample$address[Business.Name == "NULL"] <- paste(Premise.Street[Business.Name == "NULL"],",",Premise.City[Business.Name == "NULL"],",",Premise.State[Business.Name == "NULL"])
detach(jun_2015_sample)

attach(jun_2016_sample)
jun_2016_sample$address <- paste(Business.Name,",",Premise.Street,",",Premise.City,",",Premise.State)
jun_2016_sample$address[Business.Name == "NULL"] <- paste(Premise.Street[Business.Name == "NULL"],",",Premise.City[Business.Name == "NULL"],",",Premise.State[Business.Name == "NULL"])
detach(jun_2016_sample)

attach(jun_2017_sample)
jun_2017_sample$address <- paste(Business.Name,",",Premise.Street,",",Premise.City,",",Premise.State)
jun_2017_sample$address[Business.Name == "NULL"] <- paste(Premise.Street[Business.Name == "NULL"],",",Premise.City[Business.Name == "NULL"],",",Premise.State[Business.Name == "NULL"])
detach(jun_2017_sample)

#API To get long and lat
jun_2014_sample <- mutate_geocode(jun_2014_sample, address) 
jun_2014_sample <- jun_2014_sample[!is.na(jun_2014_sample$lat),]

jun_2015_sample <- mutate_geocode(jun_2015_sample, address) 
jun_2015_sample <- jun_2015_sample[!is.na(jun_2015_sample$lat),]

jun_2016_sample <- mutate_geocode(jun_2016_sample, address) 
jun_2016_sample <- jun_2016_sample[!is.na(jun_2016_sample$lat),]

jun_2017_sample <- mutate_geocode(jun_2017_sample, address) 
jun_2017_sample <- jun_2017_sample[!is.na(jun_2017_sample$lat),]

#Append table
jun_sample <- rbind(jun_2014_sample, jun_2015_sample)
jun_sample <- rbind(jun_2016_sample, jun_sample)
jun_sample <- rbind(jun_2017_sample, jun_sample)


#PLOT LAT, LONG and Average LONG
p <- ggplot(jun_sample, aes(lon, lat)) + geom_point(aes(colour = factor(year)))
p <- p + geom_hline(yintercept=mean(jun_sample$lat[jun_sample$year==2014]), color='red')
p <- p + geom_hline(yintercept=mean(jun_sample$lat[jun_sample$year==2015]), color='yellow')
p <- p + geom_hline(yintercept=mean(jun_sample$lat[jun_sample$year==2016]), color='green')
p <- p +  geom_hline(yintercept=mean(jun_sample$lat[jun_sample$year==2017]), color='blue')
p


# Density waves
p1 <- ggplot(jun_sample, aes(lon,lat,color=factor(year))) 
p1 <- p1 + geom_density_2d() 
p1 <- p1 + glimpse(jun_sample) 
p1 <- p1 + geom_hline(yintercept=mean(jun_sample$lat)) 
p1 <- p1 + facet_wrap(~year)
p1

#Analysis of lengths
p_2014 <- mean(jun_sample$lat[jun_sample$year==2014])
p_2015 <- mean(jun_sample$lat[jun_sample$year==2015])
p_2016 <- mean(jun_sample$lat[jun_sample$year==2016])
p_2017 <- mean(jun_sample$lat[jun_sample$year==2017])


#Analize merchant ID data
# Create whole dataset
## Number of IDs for month-year
length(jun_2014$Lic.Seqn)
length(unique(jun_2014$Lic.Seqn))
length(jun_2014$License.Name)
length(unique(jun_2014$License.Name))
attach(jun_2014)
jun_2014$address <- paste(License.Name,",",Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code)
jun_2014$complete_license <- paste(Lic.Regn,Lic.Dist,Lic.Cnty,Lic.Type,Lic.Xprdte,Lic.Seqn)
detach(jun_2014)
length(jun_2014$address)
length(unique(jun_2014$address))
## Looks like every merchant has just one secuence of the builtd license
length(jun_2014$complete_license)
length(unique(jun_2014$complete_license))
#Holds between years?
attach(jun_2015)
jun_2015$address <- paste(License.Name,",",Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code)
jun_2015$complete_license <- paste(Lic.Regn,Lic.Dist,Lic.Cnty,Lic.Type,Lic.Xprdte,Lic.Seqn)
detach(jun_2015)
attach(jun_2016)
jun_2016$address <- paste(License.Name,",",Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code)
jun_2016$complete_license <- paste(Lic.Regn,Lic.Dist,Lic.Cnty,Lic.Type,Lic.Xprdte,Lic.Seqn)
detach(jun_2016)
attach(jun_2017)
jun_2017$address <- paste(License.Name,",",Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code)
jun_2017$complete_license <- paste(Lic.Regn,Lic.Dist,Lic.Cnty,Lic.Type,Lic.Xprdte,Lic.Seqn)
detach(jun_2017)
#Holds 
length(jun_2015$complete_license)
length(unique(jun_2015$complete_license))
#If the merchant repeats in two different data frames (month-year)
#then we will have repetitions when we bind (append) them
jun <- rbind(jun_2014,jun_2015)
length(jun$complete_license)
length(unique(jun$complete_license))
#We can track merchants in the same data frame
#Now short and see if we have same merchant in different address
#Frecuency tables of merchants with the same License Name
a <- table(jun_2014_sample$License.Name)
a <- as.data.frame(a)
a <- a[order(-a$Freq),]
## Number repeated IDs
## Number of equal IDs between months
## Number of equal IDs between months with different addresses