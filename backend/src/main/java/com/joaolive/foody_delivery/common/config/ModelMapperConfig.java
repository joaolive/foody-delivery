package com.joaolive.foody_delivery.common.config;

import com.joaolive.foody_delivery.user.User;
import com.joaolive.foody_delivery.user.dto.UserDTO;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

	@Bean
	ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.createTypeMap(User.class, UserDTO.class).setConverter(context -> {
			User user = context.getSource();
			return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole());
		});
		return modelMapper;
	}
}
