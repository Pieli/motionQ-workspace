package config

import (
	"errors"
	"log"
	"os"

	"github.com/spf13/viper"
)

type EnvVars struct {
	MONGODB_URI        string `mapstructure:"MONGODB_URI"`
	MONGODB_NAME       string `mapstructure:"MONGODB_NAME"`
	PORT               string `mapstructure:"PORT"`
	FIREBASE_CONFIG    string `mapstructure:"FIREBASE_CONFIG"`
	INTERNAL_MAIL_PASS string `mapstructure:"INTERNAL_MAIL_PASS"`
	HELLO_MAIL_PASS    string `mapstructure:"INTERNAL_MAIL_PASS"`
	ANALYTICS_DEV      string `mapstructure:"ANALYTICS_DEV"`
	ANALYTICS_PROD     string `mapstructure:"ANALYTICS_PROD"`
}

func LoadConfig() (config EnvVars, err error) {
	env := os.Getenv("GO_ENV")

	if env == "" {
		env = "development"
	}

	log.Println("ENV:", env)

	if env == "production" {
		viper.AutomaticEnv()
		_ = viper.BindEnv("MONGODB_URI")
		_ = viper.BindEnv("MONGODB_NAME")
		_ = viper.BindEnv("PORT")
		_ = viper.BindEnv("FIREBASE_CONFIG")
		_ = viper.BindEnv("INTERNAL_MAIL_PASS")
		_ = viper.BindEnv("ANALYTICS_DEV")
		_ = viper.BindEnv("ANALYTICS_PROD")
	} else {
		viper.AddConfigPath(".")
		viper.SetConfigName("app")
		viper.SetConfigType("env")

		viper.AutomaticEnv()

		err = viper.ReadInConfig()
		if err != nil {
			return
		}

	}

	err = viper.Unmarshal(&config)
	if err != nil {
		return
	}
	// validate config here
	if config.MONGODB_URI == "" {
		err = errors.New("MONGODB_URI is required")
		return
	}

	if config.MONGODB_NAME == "" {
		err = errors.New("MONGODB_NAME is required")
		return
	}

	if config.PORT == "" {
		err = errors.New("PORT is required")
		return
	}

	if config.FIREBASE_CONFIG == "" {
		err = errors.New("FIREBASE_CONFIG is required")
		return
	}

	// if config.INTERNAL_MAIL_PASS == "" {
	// 	err = errors.New("Email env is not set")
	// 	return
	// }

	// if config.ANALYTICS_DEV == "" {
	// 	err = errors.New("ANALYTICS_DEV is required")
	// 	return
	// }

	// if config.ANALYTICS_PROD == "" {
	// 	err = errors.New("ANALYTICS_PROD is required")
	// 	return
	// }

	// TODO add hello mail pass

	return
}
